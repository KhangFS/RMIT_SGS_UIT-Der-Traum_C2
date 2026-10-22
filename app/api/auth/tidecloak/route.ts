import { NextRequest, NextResponse } from 'next/server';
import { checkTideCloakHealth, loginWithTideCloak, verifyTideCloakToken, TIDECLOAK_CONFIG } from '../../_tidecloak';

export async function GET(req: NextRequest) {
  const health = await checkTideCloakHealth();
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  let currentUser = null;
  if (token) {
    try {
      currentUser = await verifyTideCloakToken(token);
    } catch {
      // Token invalid or expired
    }
  }

  return NextResponse.json({
    status: health.online ? 'CONNECTED' : 'DISCONNECTED',
    server: TIDECLOAK_CONFIG.baseUrl,
    realm: TIDECLOAK_CONFIG.realm,
    clientId: TIDECLOAK_CONFIG.clientId,
    authenticated: !!currentUser,
    user: currentUser,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const username = body.username || 'approver-demo';
  const password = body.password || 'password123';

  try {
    const authData = await loginWithTideCloak(username, password);
    const userInfo = await verifyTideCloakToken(authData.accessToken);

    return NextResponse.json({
      success: true,
      token: authData.accessToken,
      idToken: authData.idToken,
      expiresIn: authData.expiresIn,
      user: {
        id: userInfo.sub,
        username: userInfo.preferred_username,
        name: userInfo.preferred_username === 'approver-demo' ? 'Alex Morgan (TideCloak Approver)' : userInfo.preferred_username,
        role: 'approver',
        realm: TIDECLOAK_CONFIG.realm,
        tideAuthenticated: true,
      },
      message: 'Xác thực thành công với TideCloak Emergent Authority.',
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'TIDECLOAK_AUTH_FAILED',
        message: err.message || 'Không thể xác thực với máy chủ TideCloak.',
      },
      { status: 401 }
    );
  }
}
