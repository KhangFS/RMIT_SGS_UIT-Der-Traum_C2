import { NextRequest, NextResponse } from 'next/server';
import { STORE } from '../_store';
import { verifyTideCloakToken } from '../_tidecloak';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (token) {
    try {
      const userinfo = await verifyTideCloakToken(token);
      return NextResponse.json({
        id: userinfo.sub,
        name: userinfo.preferred_username === 'approver-demo' ? 'Alex Morgan (TideCloak Approver)' : userinfo.preferred_username,
        username: userinfo.preferred_username,
        role: 'approver',
        realm: 'myrealm',
        tideAuthenticated: true,
      });
    } catch {
      // Fallback if token expired
    }
  }

  const { searchParams } = new URL(req.url);
  const requestedUser = searchParams.get('user') ?? req.headers.get('x-user');
  const requestedRole =
    searchParams.get('role') ??
    req.headers.get('x-user-role') ??
    req.headers.get('x-demo-role');

  if (requestedUser && STORE.users[requestedUser]) {
    return NextResponse.json(STORE.users[requestedUser]);
  }

  if (requestedRole === 'requester') {
    return NextResponse.json(STORE.users['requester-demo']);
  }

  return NextResponse.json(STORE.users['approver-demo']);
}
