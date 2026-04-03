import { join } from 'path';

/**
 * Root directory for CMS image uploads (`service`, `uploads`, etc.).
 * Default: `{cwd}/public/img` (works with `next start` and static `/img/...`).
 *
 * On Coolify/Docker, mount a persistent volume and set `CMS_UPLOAD_ROOT` to that
 * path so uploads survive redeploys (e.g. `/data/uploads` with folders `service/`, `uploads/` inside).
 */
export function getCmsUploadImgRoot(): string {
  const fromEnv = process.env.CMS_UPLOAD_ROOT?.trim();
  if (fromEnv) return fromEnv;
  return join(process.cwd(), 'public', 'img');
}
