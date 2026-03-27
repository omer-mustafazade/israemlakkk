import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mapDbListing } from '@/lib/api';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
