export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Test 1: no params (works in debug)
    const t1 = await sql(`SELECT COUNT(*) AS total FROM "Listing" WHERE status = 'ACTIVE'`);
    // Test 2: empty params array (what listings route does with no filters)
    const t2 = await sql(`SELECT COUNT(*) AS total FROM "Listing" WHERE status = 'ACTIVE'`, []);
    // Test 3: parameterized status
    const t3 = await sql(`SELECT COUNT(*) AS total FROM "Listing" WHERE status = $1`, ['ACTIVE']);

    return NextResponse.json({
      t1_noParams: (t1[0] as { total: string }).total,
      t2_emptyArray: (t2[0] as { total: string }).total,
      t3_parameterized: (t3[0] as { total: string }).total,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
