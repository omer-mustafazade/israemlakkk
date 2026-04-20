import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeStr } from '@/lib/validate';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name    = sanitizeStr(body.name,    { min: 2,  max: 100  });
  const phone   = sanitizeStr(body.phone,   { min: 5,  max: 30   });
  const message = sanitizeStr(body.message, { min: 5,  max: 2000 });
  const email   = sanitizeStr(body.email,   { min: 0,  max: 200  }) ?? null;

  if (!name)    return NextResponse.json({ error: 'name is required (2-100 chars)' },    { status: 400 });
  if (!phone)   return NextResponse.json({ error: 'phone is required (5-30 chars)' },    { status: 400 });
  if (!message) return NextResponse.json({ error: 'message is required (5-2000 chars)' }, { status: 400 });

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  try {
    const contact = await prisma.contactMessage.create({
      data: { name, phone, email, message },
    });
    return NextResponse.json({ success: true, id: contact.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
