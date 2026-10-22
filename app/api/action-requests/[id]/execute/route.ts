import { NextRequest, NextResponse } from 'next/server';
import { STORE } from '../../../_store';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const action = STORE.actions.find((item) => item.id === params.id);

  if (!action) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  }

  if (action.status !== 'APPROVED' || !action.tideApprovalSignature) {
    if (!Array.isArray(action.events)) action.events = [];
    action.events.push({
      id: `evt-${Date.now()}`,
      at: new Date().toISOString(),
      message: 'Execution denied · no valid TideCloak approval',
    });

    return NextResponse.json(
      {
        error: 'EXECUTION_DENIED',
        message: 'Execution blocked. Independent approval is required.',
      },
      { status: 403 }
    );
  }

  action.status = 'EXECUTED';
  action.executedAt = new Date().toISOString();

  if (!Array.isArray(action.events)) action.events = [];
  action.events.push({
    id: `evt-${Date.now()}`,
    at: action.executedAt,
    message: 'Simulated payment completed · verified by TideCloak',
  });

  action.receipt = {
    id: `SIM-${Date.now().toString().slice(-6)}`,
    executedAt: action.executedAt,
    amountVnd: action.amountVnd,
    recipientName: action.recipientName,
  };

  return NextResponse.json({
    status: 'SUCCESS',
    message: 'Phê duyệt TideCloak hợp lệ. Giao dịch giả lập đã thực thi.',
    executedAt: action.executedAt,
    receipt: action.receipt,
    events: action.events,
  });
}
