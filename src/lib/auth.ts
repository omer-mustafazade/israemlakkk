// Simple admin auth using a fixed token stored in .env
// No external dependencies required.

const TOKEN_COOKIE = 'admin_token';

export function getAdminToken(): string {
  return process.env.ADMIN_TOKEN ?? 'fallback-token';
}

export function checkPassword(password: string): boolean {
  return password === (process.env.ADMIN_PASSWORD ?? '');
}

export function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  return token === getAdminToken();
}

export { TOKEN_COOKIE };
