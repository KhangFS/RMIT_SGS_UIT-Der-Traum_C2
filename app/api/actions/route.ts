import { NextRequest, NextResponse } from 'next/server';

interface ActionRequest {
  id: string;
  actionType: 'TRANSFER_FUNDS' | 'EXPORT_DATA' | 'BENIGN_QUERY';
  payload: Record<string, any>;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'BLOCKED_PENDING_APPROVAL' | 'EXECUTED';
  tideToken?: string;
  createdAt: string;
}

const actionStore = new Map<string, ActionRequest>();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { actionType, payload, isPromptAttack } = body;
  const actionId = 'act_' + Math.random().toString(36).slice(2, 9);

  if (actionType === 'BENIGN_QUERY') {
    const action: ActionRequest = {
      id: actionId,
      actionType,
      payload,
      status: 'EXECUTED',
      createdAt: new Date().toISOString(),
    };

    actionStore.set(actionId, action);

    return NextResponse.json({
      actionId,
      status: 'EXECUTED',
      message: 'Truy vấn thông thường được thực thi ngay.',
      result: { data: 'Dữ liệu báo cáo tổng hợp.' },
    });
  }

  const action: ActionRequest = {
    id: actionId,
    actionType,
    payload,
    status: 'BLOCKED_PENDING_APPROVAL',
    createdAt: new Date().toISOString(),
  };

  actionStore.set(actionId, action);

  return NextResponse.json({
    actionId,
    status: 'BLOCKED_PENDING_APPROVAL',
    message: isPromptAttack
      ? 'Cảnh báo: Phát hiện chỉ lệnh bất thường. Hệ thống chặn thực thi trực tiếp, yêu cầu Emergent Authority từ TideCloak.'
      : 'Hành động nhạy cảm vượt ngưỡng. Cần phê duyệt qua TideCloak.',
    action,
  });
}

export async function GET() {
  return NextResponse.json({
    actions: Array.from(actionStore.values()),
  });
}
