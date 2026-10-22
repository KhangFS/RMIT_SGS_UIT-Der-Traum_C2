// Cấu hình kết nối TideCloak Identity Engine (localhost:8080)
export const config = Object.freeze({
  mode: 'connected',
  apiBase: '/api',
  pollMs: 3000,
  loginUrl: 'http://localhost:8080/realms/myrealm/protocol/openid-connect/auth?client_id=myclient&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapprover&scope=openid%20profile%20email%20roles',
  logoutUrl: '/logout',
  tideEndpoint: 'http://localhost:8080',
});
