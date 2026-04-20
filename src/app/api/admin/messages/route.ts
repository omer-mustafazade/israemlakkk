import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';
import { parsePositiveInt } from '@/lib/validate';

export async function GET(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  const sp = req.nextUrl.searchParams;
  const page  = parsePositiveInt(sp.get('page'),  { min: 1, max: 10_000 }) ?? 1;
  const limit = parsePositiveInt(sp.get('limit'), { min: 1, max: 100    }) ?? 20;
  const skip  = (page - 1) * limit;

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
