import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { getCmsUploadImgRoot } from '@/libs/uploadsPath';

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    if (!slug || slug.length < 2) {
      return NextResponse.json({ success: false, error: 'Invalid file path' }, { status: 400 });
    }

    const folder = slug[0];
    const filename = slug.slice(1).join('/');
    if (!folder || !filename || folder.includes('..') || filename.includes('..')) {
      return NextResponse.json({ success: false, error: 'Invalid file path' }, { status: 400 });
    }

    const filePath = join(getCmsUploadImgRoot(), folder, filename);
    if (!existsSync(filePath)) {
      return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = await readFile(filePath);
    const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
    const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
