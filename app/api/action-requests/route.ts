import { NextRequest, NextResponse } from 'next/server';
import { STORE } from '../_store';

export async function GET(req: NextRequest) {
  const items = STORE.actions;
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const amountVnd = Number(body.amountVnd ?? 0);
  const approvalThresholdVnd = Number(body.approvalThresholdVnd ?? 10000000);

  const request = {
    id: body.id ?? `REQ-${Date.now().toString().slice(-6)}`,
    actionType: 'PAYMENT' as const,
    status: (amountVnd > approvalThresholdVnd ? 'PENDING_APPROVAL' : 'EXECUTED') as const,
    requestedBy: body.requestedBy ?? 'requester-demo',
    amountVnd,
    approvalThresholdVnd,
    recipientId: body.recipientId ?? 'vendor-demo-001',
    recipientName: body.recipientName ?? 'Demo Office Supplies',
    invoiceId: body.invoiceId ?? 'INV-DEMO-001',
    reason: body.reason ?? 'Request created by AI agent',
    executionMode: 'SIMULATED' as const,
    tideApprovalSignature: null,
    createdAt: new Date().toISOString(),
    approvedAt: null,
    executedAt: null,
    events: [
      {
        id: `evt-${Date.now()}`,
        at: new Date().toISOString(),
        message: 'Proposal created · awaiting independent approval',
      },
    ],
    receipt: null,
  };

  STORE.actions.unshift(request);

  return NextResponse.json(request, { status: 201 });
}
