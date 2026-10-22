import { NextRequest, NextResponse } from 'next/server';
import { STORE } from '../../../_store';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const role = body.user?.role ?? body.role ?? req.headers.get('x-user-role');

  if (role !== 'approver') {
    return NextResponse.json({ error: 'FORBIDDEN', message: 'Chỉ approver mới có quyền từ chối.' }, { status: 403 });
  }

  const action = STORE.actions.find((item) => item.id === params.id);
  if (!action) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  }

  if (action.status === 'EXECUTED') {
    return NextResponse.json({ error: 'ALREADY_EXECUTED', message: 'Yêu cầu này đã được thực thi từ trước, không thể từ chối.' }, { status: 400 });
  }

  action.status = 'REJECTED';
  action.tideApprovalSignature = null;

  return NextResponse.json({
    id: action.id,
    status: 'REJECTED',
    message: 'Yêu cầu đã bị từ chối bởi người phê duyệt.',
  });
}
