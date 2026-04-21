export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { mapDbListing } from '@/lib/api';

export async function GET() {
  try {
    // Exactly what listings route does with no filters
    const where = `status = 'ACTIVE'`;
    const params: unknown[] = [];

    const [rows, countRows] = await Promise.all([
      sql(`SELECT * FROM "Listing" WHERE ${where} ORDER BY "createdAt" DESC LIMIT 12 OFFSET 0`, params),
      sql(`SELECT COUNT(*) AS total FROM "Listing" WHERE ${where}`, params),
    ]);

    const total = Number((countRows[0] as { total: string }).total);
    const mapped = rows.map(mapDbListing);

    return NextResponse.json({
      sqlRowCount: rows.length,
      countTotal: total,
      mappedCount: mapped.length,
      firstRawRow: rows[0] ? Object.keys(rows[0] as object) : null,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
