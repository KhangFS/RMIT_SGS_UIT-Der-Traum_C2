import { config } from './config.js';
import { createApi } from './api.js';
const rehearsal = config.mode === 'rehearsal';
const roleHint = new URLSearchParams(location.search).get('role') === 'approver' ? 'approver' : 'requester';
const api = createApi(roleHint);
let user = null, items = [], selectedId = null, busy = false, error = '', notice = '', dialogAction = null;
const app = document.getElementById('app');
const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const statuses = { PENDING_APPROVAL: 'Awaiting approval', APPROVED: 'Approved', EXECUTING: 'Executing', EXECUTED: 'Completed', REJECTED: 'Rejected', FAILED: 'Failed' };

function esc(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function time(value) { return new Date(value).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
function badge(item) { return `<span class="badge ${esc(item.status.toLowerCase())}">${esc(statuses[item.status] || item.status)}</span>`; }

function shell() {
  app.innerHTML = `<aside><a class="brand" href="/"><span class="brand-icon">A<span>·</span></span>Action Guard</a><div class="sidebar-label">WORKSPACE</div><nav><a class="active" href="#workspace">${user?.role === 'approver' ? 'Approval inbox' : 'Agent requests'}</a></nav><div class="sidebar-note"><span class="small-label">TIDECLOAK FABRIC</span><p>Agents propose.<br>People authorize.</p><span>Emergent Authority Enforced.</span></div><div class="profile"><span class="avatar" style="${user?.role === 'approver' ? 'background: #7c3aed;' : ''}">${user?.role === 'approver' ? 'AM' : 'JC'}</span><div><strong>${esc(user?.name || (user?.role === 'approver' ? 'Alex Morgan' : 'Jamie Chen'))}</strong><small style="color: #a78bfa; font-weight: 600;">${user?.role === 'approver' ? 'TideCloak Verified Approver' : 'AI Agent Requester'}</small></div></div></aside>
  <main id="workspace"><div class="topline"><span>Workspace <span class="slash">/</span> Payments</span><span class="mode" style="color: #c084fc; background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.4); border-radius: 4px; padding: 2px 8px;">TIDECLOAK EMERGENT AUTHORITY ACTIVE</span></div>
  <div class="demo-banner" style="background: rgba(88, 28, 135, 0.25); border: 1px solid rgba(168, 85, 247, 0.4); color: #e9d5ff;"><div><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#34d399;margin-right:8px;box-shadow:0 0 8px #34d399;"></span><strong>TideCloak Identity Engine Connected (localhost:8080)</strong> · Emergent Authority Policy Enforced</div><div><a href="/requester" style="color:#c084fc;margin-right:12px;font-weight:600;">Requester workspace ↗</a><a href="/approver" style="color:#c084fc;font-weight:600;" target="_blank" rel="noopener">Approver workspace ↗</a></div></div>
  <header><div class="eyebrow">AI AGENT ACTION GUARD · TIDECLOAK PROTECTED</div><h1>${user?.role === 'approver' ? 'Your judgment. Before action.' : 'Delegate the work. Keep control.'}</h1><p>${user?.role === 'approver' ? 'Review the recipient, amount and purpose before authorizing via TideCloak.' : 'Prepare a payment request. Independent TideCloak approval comes before execution.'}</p></header>
  <div id="feedback" aria-live="polite"></div><section class="metrics" id="metrics" aria-label="Request summary"></section>
  <div class="work-grid"><section class="left-column">${user?.role === 'requester' ? formMarkup() : approverTideCloakCard()}<section class="panel"><div class="panel-heading"><h2>${user?.role === 'approver' ? 'Review queue' : 'Recent requests'}</h2><button class="text-button" id="refresh">Refresh</button></div><div id="request-list"></div></section></section><section id="detail" class="panel detail" aria-label="Request detail"></section></div>
  <footer><span>Only synthetic invoices. Protected by TideCloak Emergent Authority.</span>${user?.role === 'requester' ? '<button class="text-button" id="reset">Reset rehearsal</button>' : ''}</footer></main>
  <dialog id="confirm-dialog" aria-labelledby="dialog-title"><form method="dialog"><h2 id="dialog-title">Confirm decision</h2><div id="dialog-body"></div><div class="dialog-actions"><button value="cancel" class="secondary">Cancel</button><button type="button" id="confirm-action" class="primary" style="background: #7c3aed;">Confirm & Sign</button></div></form></dialog>`;
  document.getElementById('refresh').onclick = () => refresh(true);
  document.getElementById('request-form')?.addEventListener('submit', submit);
  document.getElementById('reset')?.addEventListener('click', () => openDialog('reset'));
  document.getElementById('confirm-action').onclick = confirmAction;
  document.getElementById('confirm-dialog').addEventListener('close', () => { dialogAction = null; });
  paint();
}

function formMarkup() {
  return `<section class="panel compose"><div class="panel-heading"><h2>Prepare a payment</h2><span class="tiny-tag">SIMULATED AGENT</span></div><form id="request-form"><label for="supplier">Supplier</label><select id="supplier" name="recipientId"><option value="vendor-demo-001">Demo Office Supplies</option></select><div class="form-row"><div><label for="amount">Amount · VND</label><input id="amount" name="amountVnd" type="number" min="1" max="1000000000" step="1" value="15000000" required></div><div><label for="invoice">Invoice</label><input id="invoice" value="INV-DEMO-001" readonly></div></div><label for="reason">Payment purpose</label><textarea id="reason" name="reason" maxlength="280" rows="2" required>Office equipment — synthetic demonstration invoice.</textarea><div class="policy-note"><strong>Independent TideCloak review required</strong><span>All payments need approval. Amounts above ₫10,000,000 are flagged as high value.</span></div><button class="primary full" type="submit" id="submit-request">Send for approval <span>↗</span></button></form></section>`;
}

function approverTideCloakCard() {
  const token = api.getToken();
  const tokenDisplay = token ? `${token.slice(0, 16)}...${token.slice(-12)}` : 'Handshake active with TideCloak...';
  return `<section class="panel compose" style="border: 1px solid rgba(168, 85, 247, 0.45); background: linear-gradient(180deg, rgba(88, 28, 135, 0.3) 0%, rgba(15, 23, 42, 0.8) 100%); margin-bottom: 1rem;">
    <div class="panel-heading">
      <h2>TideCloak Gatekeeper</h2>
      <span class="tiny-tag" style="background: #34d399; color: #064e3b; font-weight: 700;">CONNECTED</span>
    </div>
    <div style="font-size: 0.82rem; padding: 0.25rem 0.75rem 0.75rem 0.75rem; color: #cbd5e1; display: grid; gap: 8px;">
      <div style="display: flex; justify-content: space-between;">
        <span style="color: #94a3b8;">Operator:</span>
        <strong style="color: #f1f5f9;">Alex Morgan (${esc(user?.username || 'approver-demo')})</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="color: #94a3b8;">IAM Node:</span>
        <span style="color: #c084fc; font-family: monospace;">localhost:8080/realms/myrealm</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="color: #94a3b8;">Client ID:</span>
        <span style="color: #c084fc; font-family: monospace;">myclient</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="color: #94a3b8;">Quorum Rule:</span>
        <span style="color: #38bdf8; font-weight: 600;">1/1 Emergent Authority Signature</span>
      </div>
      <div style="margin-top: 6px; padding: 6px 10px; background: rgba(0,0,0,0.5); border-radius: 6px; font-family: monospace; font-size: 0.72rem; word-break: break-all; color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.25);">
        Tide Token: <span id="jwt-token-display">${tokenDisplay}</span>
      </div>
    </div>
  </section>`;
}

function detailMarkup(item) {
  return `<div class="panel-heading"><div><span class="small-label">REQUEST DETAIL</span><h2>${esc(item.id)}</h2></div>${badge(item)}</div><div class="amount-hero"><span>Payment amount</span><strong>${money.format(item.amountVnd)}</strong>${item.amountVnd > item.approvalThresholdVnd ? '<span class="high-value">Above review threshold</span>' : ''}</div><dl><div><dt>Recipient</dt><dd>${esc(item.recipientName)}</dd></div><div><dt>Invoice</dt><dd>${esc(item.invoiceId)}</dd></div><div><dt>Requested by</dt><dd>${esc(item.requestedBy)}</dd></div><div><dt>Purpose</dt><dd>${esc(item.reason)}</dd></div></dl>
  <div style="margin: 1rem 0; padding: 0.75rem 1rem; border-radius: 8px; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(139, 92, 246, 0.35);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
      <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #c084fc; font-weight: 700;">TideCloak Emergent Authority</span>
      <span class="badge ${item.tideApprovalSignature ? 'approved' : 'pending_approval'}" style="font-size: 0.7rem;">
        ${item.tideApprovalSignature ? 'Signature Verified' : 'Locked · Approval Required'}
      </span>
    </div>
    <div style="font-size: 0.75rem; color: #94a3b8; font-family: monospace;">
      <div>Policy Threshold: <strong>1/1 Human Operator Signature Required</strong></div>
      <div style="margin-top: 4px; word-break: break-all;">Signature: <span style="color: #38bdf8; font-weight: 600;">${esc(item.tideApprovalSignature || 'Awaiting TideCloak signature...')}</span></div>
    </div>
  </div>
  <div class="decision"><p>${item.status === 'PENDING_APPROVAL' ? 'Execution is locked until an authorized person approves this exact request via TideCloak.' : item.status === 'APPROVED' ? 'TideCloak approval recorded. The payment has not been executed yet.' : item.status === 'REJECTED' ? 'This request was rejected and cannot be executed.' : item.status === 'EXECUTED' ? 'Simulation complete. Verified and executed with TideCloak authority.' : 'Review the current execution status.'}</p>${user?.role === 'approver' && item.status === 'PENDING_APPROVAL' ? '<div class="button-row"><button class="secondary" data-action="reject">Reject</button><button class="primary" data-action="approve" style="background: #7c3aed;">Authorize via TideCloak ↗</button></div>' : ''}${user?.role === 'requester' && ['PENDING_APPROVAL', 'APPROVED'].includes(item.status) ? `<button class="${item.status === 'APPROVED' ? 'primary' : 'secondary'} full" data-action="execute">${item.status === 'APPROVED' ? 'Execute simulated payment' : 'Try execution · verify protection'}</button>` : ''}</div>
  ${item.receipt ? `<div class="receipt"><span class="small-label">SIMULATED RECEIPT</span><strong>${esc(item.receipt.id)}</strong><span>${money.format(item.receipt.amountVnd)} · ${esc(item.receipt.recipientName)}</span></div>` : ''}<h3>Activity</h3><ol class="timeline">${(item.events || []).map(event => `<li><span class="timeline-dot"></span><div><p>${esc(event.message)}</p><time>${time(event.at)}</time></div></li>`).join('')}</ol>`;
}

function paint() {
  if (!document.getElementById('metrics')) return;
  document.getElementById('feedback').innerHTML = error ? `<div class="alert" role="alert">${esc(error)}</div>` : notice ? `<div class="success">${esc(notice)}</div>` : '';
  document.getElementById('metrics').innerHTML = [['Requests', items.length], ['Awaiting approval', items.filter(x => x.status === 'PENDING_APPROVAL').length], ['Completed', items.filter(x => x.status === 'EXECUTED').length]].map(([label, n]) => `<div><span>${label}</span><strong>${n.toString().padStart(2, '0')}</strong></div>`).join('');
  document.getElementById('request-list').innerHTML = items.length ? items.map(item => `<button class="request-row ${selectedId === item.id ? 'selected' : ''}" data-select="${esc(item.id)}" aria-pressed="${selectedId === item.id}"><span><strong>${esc(item.recipientName)}</strong><small>${esc(item.id)}</small></span><span class="request-right"><strong>${money.format(item.amountVnd)}</strong>${badge(item)}</span></button>`).join('') : '<div class="empty"><span class="empty-symbol">↗</span><strong>No requests yet</strong><p>Create a request in the Requester workspace to begin.</p></div>';
  document.querySelectorAll('[data-select]').forEach(button => { button.onclick = () => { selectedId = button.dataset.select; paint(); }; });
  const item = items.find(x => x.id === selectedId);
  document.getElementById('detail').innerHTML = item ? detailMarkup(item) : '<div class="empty detail-empty"><span class="empty-symbol">◇</span><h2>Every action has a checkpoint.</h2><p>Select a request to see its details, approval status and activity.</p><div class="mini-flow">Propose <span>→</span> Approve <span>→</span> Execute</div></div>';
  const tokenEl = document.getElementById('jwt-token-display');
  if (tokenEl) {
    const token = api.getToken();
    tokenEl.textContent = token ? `${token.slice(0, 16)}...${token.slice(-12)}` : 'Handshake active with TideCloak...';
  }
  document.querySelectorAll('[data-action]').forEach(button => { button.onclick = () => button.dataset.action === 'execute' ? runAction('execute') : openDialog(button.dataset.action); });
  document.querySelectorAll('button[type="submit"], [data-action], #refresh, #reset').forEach(button => button.disabled = busy);
}

async function refresh(manual = false) {
  if (busy || document.getElementById('confirm-dialog')?.open) return;
  try {
    const result = await api.list();
    const rawItems = Array.isArray(result) ? result : (result?.items || []);
    const changed = JSON.stringify(rawItems) !== JSON.stringify(items);
    items = rawItems;
    if (!items.some(x => x.id === selectedId)) selectedId = items[0]?.id || null;
    if (manual) { error = ''; notice = 'Workspace refreshed.'; }
    if (changed || manual) paint();
  } catch (e) {
    error = e.message;
    paint();
  }
}

async function submit(event) {
  event.preventDefault();
  if (busy) return;
  const form = new FormData(event.target);
  busy = true; error = ''; notice = ''; paint();
  try {
    const item = await api.create({
      recipientId: form.get('recipientId'),
      amountVnd: Number(form.get('amountVnd')),
      reason: form.get('reason'),
    });
    selectedId = item.id;
    notice = 'Request submitted. Waiting for independent TideCloak approval.';
  } catch (e) {
    error = e.message;
  } finally {
    busy = false;
    await refresh();
    paint();
  }
}

function openDialog(action) {
  const item = items.find(x => x.id === selectedId);
  dialogAction = { action, id: item?.id };
  document.getElementById('dialog-title').textContent = action === 'reset' ? 'Reset demo state?' : action === 'approve' ? 'Authorize via TideCloak?' : 'Reject this request?';
  document.getElementById('dialog-body').innerHTML = action === 'reset'
    ? '<p>Clear only the in-memory requests and restore the demo baseline.</p>'
    : `<p>${esc(item.recipientName)}</p><strong class="dialog-amount">${money.format(item.amountVnd)}</strong><p>${esc(item.id)} · ${esc(item.invoiceId)}</p><p style="color: #c084fc; margin-top: 8px;"><strong>TideCloak Verification:</strong> Confirming this action will sign the payload via TideCloak threshold consensus. This satisfies the Emergent Authority policy and unlocks execution.</p>`;
  document.getElementById('confirm-dialog').showModal();
}

async function confirmAction() {
  const decision = dialogAction;
  document.getElementById('confirm-dialog').close();
  if (decision) await runAction(decision.action, decision.id);
}

async function runAction(action, id = selectedId) {
  if (busy) return;
  busy = true; error = ''; notice = ''; paint();
  try {
    const result = action === 'reset' ? await api.reset() : await api.action(id, action);
    notice = action === 'reset'
      ? 'Demo data reset.'
      : action === 'approve'
      ? 'TideCloak authorization signature recorded. Execution is unlocked.'
      : action === 'reject'
      ? 'Request rejected.'
      : 'Simulated payment executed with TideCloak authority.';
  } catch (e) {
    error = e.message;
  } finally {
    busy = false;
    await refresh();
    paint();
  }
}

async function start() {
  try {
    user = await api.me();
    shell();
    await refresh();
    setInterval(() => { if (!document.hidden) refresh(); }, config.pollMs);
    window.addEventListener('focus', () => refresh());
  } catch (e) {
    app.innerHTML = `<div class="auth-error"><h1>Workspace unavailable</h1><p>${esc(e.message)}</p><a href="${esc(config.loginUrl)}">Sign in with TideCloak</a></div>`;
  }
}

start();
