export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const [dbInfo, countAll, countActive, firstRow] = await Promise.all([
      sql('SELECT current_database() AS db, current_user AS usr'),
      sql('SELECT COUNT(*) AS total FROM "Listing"'),
      sql(`SELECT COUNT(*) AS total FROM "Listing" WHERE status = 'ACTIVE'`),
      sql('SELECT id, status, "titleAz" FROM "Listing" LIMIT 1'),
    ]);
    return NextResponse.json({
      database: (dbInfo[0] as { db: string; usr: string }).db,
      listingCountAll: (countAll[0] as { total: string }).total,
      listingCountActive: (countActive[0] as { total: string }).total,
      firstRow: firstRow[0] ?? null,
      urlHost: (() => { try { return new URL(process.env.DATABASE_URL ?? '').hostname; } catch { return 'PARSE_ERROR'; } })(),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
