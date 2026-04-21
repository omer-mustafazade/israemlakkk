export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const [dbInfo, count] = await Promise.all([
      sql('SELECT current_database() AS db, current_user AS usr'),
      sql('SELECT COUNT(*) AS total FROM "Listing"'),
    ]);
    return NextResponse.json({
      database: (dbInfo[0] as { db: string; usr: string }).db,
      user: (dbInfo[0] as { db: string; usr: string }).usr,
      listingCount: (count[0] as { total: string }).total,
      urlHost: (() => { try { return new URL(process.env.DATABASE_URL ?? '').hostname; } catch { return 'PARSE_ERROR'; } })(),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
