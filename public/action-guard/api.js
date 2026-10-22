import { config } from './config.js';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function createApi(role) {
  let tideToken = typeof window !== 'undefined' ? localStorage.getItem('tidecloak_token') : null;

  async function ensureTideAuth() {
    if (role === 'approver' && !tideToken) {
      try {
        const res = await fetch(`${config.apiBase}/auth/tidecloak`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'approver-demo', password: 'password123' }),
        });
        if (res.ok) {
          const data = await res.json();
          tideToken = data.token;
          if (typeof window !== 'undefined') localStorage.setItem('tidecloak_token', tideToken);
        }
      } catch (err) {
        console.warn('TideCloak auto-auth handshake warning:', err);
      }
    }
    return tideToken;
  }

  async function request(path, method = 'GET', body) {
    await ensureTideAuth();

    const headers = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    headers['X-Demo-Role'] = role;
    headers['X-TideCloak-Role'] = role;
    headers['X-TideCloak-Auth'] = 'true';
    if (tideToken) {
      headers['Authorization'] = `Bearer ${tideToken}`;
    }

    let response = await fetch(`${config.apiBase}${path}`, {
      method,
      headers,
      credentials: 'same-origin',
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    if (response.status === 401 && tideToken) {
      // Token hết hạn, xóa token cũ và lấy token mới từ TideCloak
      tideToken = null;
      if (typeof window !== 'undefined') localStorage.removeItem('tidecloak_token');
      const freshToken = await ensureTideAuth();
      if (freshToken) {
        headers['Authorization'] = `Bearer ${freshToken}`;
        response = await fetch(`${config.apiBase}${path}`, {
          method,
          headers,
          credentials: 'same-origin',
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: AbortSignal.timeout(15000),
        });
      }
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(response.status, data.message || `Request failed (${response.status})`);
    }
    return data;
  }

  return {
    me: () => request('/me'),
    list: () => request('/action-requests'),
    create: (body) => request('/action-requests', 'POST', body),
    action: (id, action) =>
      request(`/action-requests/${encodeURIComponent(id)}/${action}`, 'POST', { user: { role } }),
    reset: () => request('/dev/reset', 'POST', {}),
    tidecloakAuth: async (username, password) => {
      const res = await fetch(`${config.apiBase}/auth/tidecloak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new ApiError(res.status, data.message || 'Xác thực TideCloak thất bại');
      tideToken = data.token;
      if (typeof window !== 'undefined') localStorage.setItem('tidecloak_token', tideToken);
      return data;
    },
    tidecloakStatus: async () => {
      const res = await fetch(`${config.apiBase}/auth/tidecloak`);
      return res.json().catch(() => ({ status: 'UNKNOWN' }));
    },
    getToken: () => tideToken,
  };
}
