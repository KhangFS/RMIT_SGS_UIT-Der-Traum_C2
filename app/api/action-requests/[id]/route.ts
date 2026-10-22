import { NextRequest, NextResponse } from 'next/server';
import { STORE } from '../../_store';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const action = STORE.actions.find((item) => item.id === params.id);

  if (!action) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  }

  return NextResponse.json(action);
}
