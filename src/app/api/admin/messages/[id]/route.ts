import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;
  const { id } = await params;
  try {
    const { isRead } = await req.json();
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: !!isRead },
    });
    return NextResponse.json(message);
  } catch {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;
  const { id } = await params;
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
