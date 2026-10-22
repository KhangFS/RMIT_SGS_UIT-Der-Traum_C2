import { NextResponse } from 'next/server';
import { resetStore } from '../../_store';

export async function POST() {
  resetStore();

  return NextResponse.json({
    success: true,
    message: 'Bộ nhớ RAM đã được reset về bản ghi demo mẫu.',
  });
}
