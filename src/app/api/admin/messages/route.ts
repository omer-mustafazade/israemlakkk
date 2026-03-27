import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const skip = (page - 1) * limit;

  try {
    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count(),
    ]);

    return NextResponse.json({
      messages,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
