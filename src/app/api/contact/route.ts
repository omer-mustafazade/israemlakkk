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

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
  }

  if (typeof phone !== 'string' || phone.trim().length < 5 || phone.trim().length > 30) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
  }

  if (typeof message !== 'string' || message.trim().length < 5 || message.trim().length > 2000) {
    return NextResponse.json({ error: 'Message must be between 5 and 2000 characters' }, { status: 400 });
  }

  if (email && (typeof email !== 'string' || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  try {
    const contact = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        message: message.trim(),
      },
    });
    return NextResponse.json({ success: true, id: contact.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
