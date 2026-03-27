import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalListings, activeListings, soldListings, rentedListings, totalMessages, unreadMessages, viewsResult] =
      await Promise.all([
        prisma.listing.count(),
        prisma.listing.count({ where: { status: 'ACTIVE' } }),
        prisma.listing.count({ where: { status: 'SOLD' } }),
        prisma.listing.count({ where: { status: 'RENTED' } }),
        prisma.contactMessage.count(),
        prisma.contactMessage.count({ where: { isRead: false } }),
        prisma.listing.aggregate({ _sum: { viewCount: true } }),
      ]);

    return NextResponse.json({
      totalListings,
      activeListings,
      soldListings,
      rentedListings,
      totalMessages,
      unreadMessages,
      totalViews: viewsResult._sum.viewCount ?? 0,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
