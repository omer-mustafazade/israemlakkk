export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { mapDbListing } from '@/lib/api';
import {
  sanitizeStr, parsePositiveInt, parsePositiveFloat,
  assertEnum, CATEGORY, PROPERTY_TYPE, SORT_FIELDS, SORT_ORDERS,
} from '@/lib/validate';

// Maps validated Prisma field names to quoted SQL column names.
const COL: Record<string, string> = {
  price: '"price"',
  area: '"area"',
  createdAt: '"createdAt"',
  viewCount: '"viewCount"',
};

const FEATURE_COL: Record<string, string> = {
  parking:   '"hasParking"',
  balcony:   '"hasBalcony"',
  elevator:  '"hasElevator"',
  furniture: '"hasFurniture"',
  pool:      '"hasPool"',
  security:  '"hasSecurity"',
  ac:        '"hasAC"',
  internet:  '"hasInternet"',
  gym:       '"hasGym"',
};

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const page  = parsePositiveInt(sp.get('page'),  { min: 1, max: 1000 }) ?? 1;
  const limit = parsePositiveInt(sp.get('limit'), { min: 1, max: 50   }) ?? 12;
  const skip  = (page - 1) * limit;

  const category     = assertEnum(sp.get('category'),     CATEGORY);
  const propertyType = assertEnum(sp.get('propertyType'), PROPERTY_TYPE);
  const sortBy    = assertEnum(sp.get('sortBy'),    SORT_FIELDS) ?? 'createdAt';
  const sortOrder = assertEnum(sp.get('sortOrder'), SORT_ORDERS) ?? 'desc';

  const city     = sanitizeStr(sp.get('city'), { max: 100 });
  const minPrice = parsePositiveFloat(sp.get('minPrice'), { min: 0, max: 1_000_000_000 });
  const maxPrice = parsePositiveFloat(sp.get('maxPrice'), { min: 0, max: 1_000_000_000 });
  const minArea  = parsePositiveFloat(sp.get('minArea'),  { min: 0, max: 999_999 });
  const maxArea  = parsePositiveFloat(sp.get('maxArea'),  { min: 0, max: 999_999 });
  const rooms    = parsePositiveInt(sp.get('rooms'),    { min: 1, max: 99 });
  const minRooms = parsePositiveInt(sp.get('minRooms'), { min: 1, max: 99 });
  const isFeatured = sp.get('featured') === 'true';

  const features = (sp.get('features') ?? '')
    .split(',')
    .filter((f) => f in FEATURE_COL);

  // Build parameterized WHERE clause.
  // Enum/boolean values are safe to inline (validated against allowlists).
  // User-supplied strings/numbers go through parameterized queries.
  const conds: string[] = [`status = 'ACTIVE'`];
  const params: unknown[] = [];
  let i = 1;

  if (category)     { conds.push(`category = $${i++}`);          params.push(category); }
  if (propertyType) { conds.push(`"propertyType" = $${i++}`);    params.push(propertyType); }
  if (city)         { conds.push(`city ILIKE $${i++}`);          params.push(`%${city}%`); }
  if (isFeatured)   { conds.push(`"isFeatured" = true`); }
  if (minRooms)     { conds.push(`rooms >= $${i++}`);            params.push(minRooms); }
  else if (rooms)   { conds.push(`rooms = $${i++}`);             params.push(rooms); }
  if (minPrice !== null) { conds.push(`price >= $${i++}`);       params.push(minPrice); }
  if (maxPrice !== null) { conds.push(`price <= $${i++}`);       params.push(maxPrice); }
  if (minArea  !== null) { conds.push(`area >= $${i++}`);        params.push(minArea); }
  if (maxArea  !== null) { conds.push(`area <= $${i++}`);        params.push(maxArea); }
  for (const f of features) {
    conds.push(`${FEATURE_COL[f]} = true`);
  }

  const where    = conds.join(' AND ');
  const orderCol = COL[sortBy] ?? '"createdAt"';
  const orderDir = sortOrder === 'asc' ? 'ASC' : 'DESC';

  try {
    const [rows, countRows] = await Promise.all([
      sql(
        `SELECT * FROM "Listing" WHERE ${where} ORDER BY ${orderCol} ${orderDir} LIMIT ${limit} OFFSET ${skip}`,
        params,
      ),
      sql(`SELECT COUNT(*) AS total FROM "Listing" WHERE ${where}`, params),
    ]);

    const total = Number((countRows[0] as { total: string }).total);

    return NextResponse.json(
      {
        _v: 'neon-v2',
        listings: rows.map(mapDbListing),
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Failed to fetch listings', detail: msg }, { status: 500 });
  }
}
