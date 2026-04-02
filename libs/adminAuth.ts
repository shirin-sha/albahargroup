export const ADMIN_COOKIE_NAME = 'albahar_admin';

type TokenPayload = {
  exp: number; // unix seconds
};

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array) {
  // btoa expects binary string
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(s: string) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacSha256(secret: string, data: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return new Uint8Array(sig);
}

export async function createAdminToken(args: { secret: string; ttlSeconds?: number }) {
  const ttl = args.ttlSeconds ?? 60 * 60 * 24 * 7; // 7 days
  const payload: TokenPayload = { exp: Math.floor(Date.now() / 1000) + ttl };
  const payloadB64 = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const sig = await hmacSha256(args.secret, payloadB64);
  const sigB64 = toBase64Url(sig);
  return `${payloadB64}.${sigB64}`;
}

export async function verifyAdminToken(args: { token: string; secret: string }) {
  const [payloadB64, sigB64] = args.token.split('.');
  if (!payloadB64 || !sigB64) return { ok: false as const };

  let payloadBytes: Uint8Array;
  try {
    payloadBytes = fromBase64Url(payloadB64);
  } catch {
    return { ok: false as const };
  }

  let payload: TokenPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(payloadBytes));
  } catch {
    return { ok: false as const };
  }

  if (!payload?.exp || typeof payload.exp !== 'number') return { ok: false as const };
  if (payload.exp < Math.floor(Date.now() / 1000)) return { ok: false as const };

  const expected = await hmacSha256(args.secret, payloadB64);
  const actual = fromBase64Url(sigB64);
  if (actual.length !== expected.length) return { ok: false as const };

  // constant-time compare
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
  if (diff !== 0) return { ok: false as const };

  return { ok: true as const, payload };
}

