import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, email, message } = body;

  if (!name || !phone || !message) {
    return NextResponse.json(
      { error: 'name, phone and message are required' },
      { status: 400 }
    );
  }

  try {
    const contact = await prisma.contactMessage.create({
      data: { name, phone, email: email ?? null, message },
    });
    return NextResponse.json({ success: true, id: contact.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
