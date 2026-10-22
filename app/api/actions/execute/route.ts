import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { actionId, approverSignature, tideApproved } = await req.json();

  if (!tideApproved || !approverSignature) {
    return NextResponse.json(
      {
        error: 'ACCESS_DENIED',
        message: 'Từ chối thực thi: Thiếu chữ ký xác thực hoặc chưa đủ điều kiện chính sách từ TideCloak.',
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    status: 'SUCCESS',
    message: 'Emergent Authority được xác lập thành công qua TideCloak. Giao dịch đã hoàn tất.',
    executedAt: new Date().toISOString(),
    actionId,
  });
}
