import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET || '';
  if (!secret) {
    return NextResponse.json(
      { success: false, error: 'REVALIDATE_SECRET is not configured.' },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const provided = (body?.secret ?? '').toString();
  if (provided !== secret) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const tags: string[] = Array.isArray(body?.tags) ? body.tags.map(String) : [];
  const paths: string[] = Array.isArray(body?.paths) ? body.paths.map(String) : [];

  if (tags.length === 0 && paths.length === 0) {
    return NextResponse.json(
      { success: false, error: 'Provide at least one tag or path.' },
      { status: 400 }
    );
  }

  for (const t of tags) revalidateTag(t, 'default');
  for (const p of paths) revalidatePath(p);

  return NextResponse.json({ success: true, revalidated: { tags, paths } });
}

