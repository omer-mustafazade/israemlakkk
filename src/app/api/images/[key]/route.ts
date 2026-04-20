import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';
import { sanitizeId } from '@/lib/validate';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key: rawKey } = await params;
  const key = sanitizeId(rawKey);
  if (!key) return NextResponse.json({ error: 'Invalid key' }, { status: 400 });

  try {
    const store = getStore('images');
    const { data, metadata } = await store.getWithMetadata(key, { type: 'arrayBuffer' });

    if (data === null) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const contentType = (metadata?.contentType as string) ?? 'image/jpeg';
    return new NextResponse(data as ArrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to retrieve image' }, { status: 500 });
  }
}
