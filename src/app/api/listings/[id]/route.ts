import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mapDbListing } from '@/lib/api';
import { sanitizeId } from '@/lib/validate';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = sanitizeId(rawId);
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  try {
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Increment view count (fire and forget)
    prisma.listing.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    return NextResponse.json(mapDbListing(listing));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}
