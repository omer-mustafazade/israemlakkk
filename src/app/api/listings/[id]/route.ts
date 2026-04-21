export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { mapDbListing } from '@/lib/api';
import { sanitizeId } from '@/lib/validate';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = sanitizeId(rawId);
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  try {
    const rows = await sql(`SELECT * FROM "Listing" WHERE id = $1`, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Increment view count — fire and forget
    sql(`UPDATE "Listing" SET "viewCount" = "viewCount" + 1 WHERE id = $1`, [id]).catch(() => {});

    return NextResponse.json(mapDbListing(rows[0]));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to fetch listing', detail: msg }, { status: 500 });
  }
}
