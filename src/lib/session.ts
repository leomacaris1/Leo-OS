// Stateless session tokens for the single-password app gate.
// Signs "<expiry>" with HMAC-SHA256 using ADMIN_PASSWORD as the key, so no
// session storage is needed and it works in both the Edge middleware and
// Node API routes (Web Crypto is available in both runtimes).

export const SESSION_COOKIE_NAME = 'leo_os_session';
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex: string): Uint8Array | null {
  const matches = hex.match(/.{1,2}/g);
  if (!matches) return null;
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
}

export async function createSessionToken(secret: string): Promise<string> {
  const expiry = Date.now() + SESSION_TTL_MS;
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(String(expiry)));
  return `${expiry}.${toHex(signature)}`;
}

export async function verifySessionToken(token: string | undefined | null, secret: string): Promise<boolean> {
  if (!token) return false;

  const [expiryStr, signatureHex] = token.split('.');
  if (!expiryStr || !signatureHex) return false;

  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  const signatureBytes = fromHex(signatureHex);
  if (!signatureBytes) return false;

  const key = await getKey(secret);
  return crypto.subtle.verify('HMAC', key, signatureBytes as BufferSource, new TextEncoder().encode(expiryStr));
}
