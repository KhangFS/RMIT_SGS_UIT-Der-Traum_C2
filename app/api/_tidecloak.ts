import crypto from 'crypto';

export const TIDECLOAK_CONFIG = {
  baseUrl: process.env.TIDECLOAK_URL || 'http://localhost:8080',
  realm: 'myrealm',
  clientId: 'myclient',
};

export interface TideCloakUserInfo {
  sub: string;
  preferred_username: string;
  email?: string;
  email_verified?: boolean;
  realm_access?: {
    roles: string[];
  };
}

export async function checkTideCloakHealth(): Promise<{ online: boolean; realm: string; error?: string }> {
  try {
    const res = await fetch(`${TIDECLOAK_CONFIG.baseUrl}/realms/${TIDECLOAK_CONFIG.realm}/.well-known/openid-configuration`, {
      signal: AbortSignal.timeout(3000),
    });
    return { online: res.ok, realm: TIDECLOAK_CONFIG.realm };
  } catch (err: any) {
    return { online: false, realm: TIDECLOAK_CONFIG.realm, error: err.message };
  }
}

export async function loginWithTideCloak(username = 'approver-demo', password = 'password123') {
  const tokenEndpoint = `${TIDECLOAK_CONFIG.baseUrl}/realms/${TIDECLOAK_CONFIG.realm}/protocol/openid-connect/token`;
  const body = new URLSearchParams({
    client_id: TIDECLOAK_CONFIG.clientId,
    grant_type: 'password',
    username,
    password,
    scope: 'openid profile email roles',
  });

  const res = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error_description || errorData.error || `TideCloak token error (${res.status})`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type,
  };
}

export async function verifyTideCloakToken(token: string): Promise<TideCloakUserInfo> {
  const userinfoEndpoint = `${TIDECLOAK_CONFIG.baseUrl}/realms/${TIDECLOAK_CONFIG.realm}/protocol/openid-connect/userinfo`;
  const res = await fetch(userinfoEndpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    throw new Error(`TideCloak token verification failed with status ${res.status}`);
  }

  return (await res.json()) as TideCloakUserInfo;
}

export function generateTideSignature(requestId: string, username: string, token: string): string {
  const tokenFingerprint = crypto.createHash('sha256').update(token).digest('hex').slice(0, 16);
  const digest = crypto
    .createHash('sha256')
    .update(`${requestId}:${username}:${tokenFingerprint}:${Date.now()}`)
    .digest('hex')
    .slice(0, 24)
    .toUpperCase();
  return `TIDE_EA_${digest}`;
}
