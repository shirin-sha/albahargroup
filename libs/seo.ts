export const DEFAULT_SITE_NAME = 'Al Bahar Group';

export function getSiteUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
  if (!envUrl) return 'http://localhost:3000';
  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === '/') return `${base}/`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
