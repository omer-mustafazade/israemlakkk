import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';
import { requireAdminAuth } from '@/lib/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP and GIF images are allowed' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'File size must be under 5MB' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() ?? 'jpg';
    const key = `${crypto.randomUUID()}.${ext}`;

    const store = getStore('images');
    await store.set(key, await file.arrayBuffer(), {
      metadata: { contentType: file.type },
    });

    const url = `/api/images/${key}`;
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
