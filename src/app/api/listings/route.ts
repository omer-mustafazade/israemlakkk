import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mapDbListing } from '@/lib/api';
import {
  sanitizeStr, parsePositiveInt, parsePositiveFloat,
  assertEnum, CATEGORY, PROPERTY_TYPE, SORT_FIELDS, SORT_ORDERS,
} from '@/lib/validate';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  // Pagination — hard cap to prevent DB abuse
  const page  = parsePositiveInt(sp.get('page'),  { min: 1, max: 1000 }) ?? 1;
  const limit = parsePositiveInt(sp.get('limit'), { min: 1, max: 50   }) ?? 12;
  const skip  = (page - 1) * limit;

  // Enum filters
  const category     = assertEnum(sp.get('category'),     CATEGORY);
  const propertyType = assertEnum(sp.get('propertyType'), PROPERTY_TYPE);
  const sortBy    = assertEnum(sp.get('sortBy'),    SORT_FIELDS)    ?? 'createdAt';
  const sortOrder = assertEnum(sp.get('sortOrder'), SORT_ORDERS)    ?? 'desc';

  // String filters
  const city = sanitizeStr(sp.get('city'), { max: 100 });

  // Numeric filters
  const minPrice = parsePositiveFloat(sp.get('minPrice'), { min: 0, max: 1_000_000_000 });
  const maxPrice = parsePositiveFloat(sp.get('maxPrice'), { min: 0, max: 1_000_000_000 });
  const minArea  = parsePositiveFloat(sp.get('minArea'),  { min: 0, max: 999_999 });
  const maxArea  = parsePositiveFloat(sp.get('maxArea'),  { min: 0, max: 999_999 });
  const rooms    = parsePositiveInt(sp.get('rooms'),    { min: 1, max: 99 });
  const minRooms = parsePositiveInt(sp.get('minRooms'), { min: 1, max: 99 });

  const isFeatured = sp.get('featured') === 'true';

  // Feature flags — allowlist each value
  const ALLOWED_FEATURES = new Set(['parking','balcony','elevator','furniture','pool','security','ac','internet','gym']);
  const features = sp.get('features')
    ? sp.get('features')!.split(',').filter((f) => ALLOWED_FEATURES.has(f))
    : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { status: 'ACTIVE' };
  if (category)     where.category     = category;
  if (propertyType) where.propertyType = propertyType;
  if (city)         where.city = { contains: city };
  if (isFeatured)   where.isFeatured = true;
  if (rooms)        where.rooms = rooms;
  if (minRooms)     where.rooms = { gte: minRooms };

  if (minPrice !== null || maxPrice !== null) {
    where.price = {};
    if (minPrice !== null) where.price.gte = minPrice;
    if (maxPrice !== null) where.price.lte = maxPrice;
  }
  if (minArea !== null || maxArea !== null) {
    where.area = {};
    if (minArea !== null) where.area.gte = minArea;
    if (maxArea !== null) where.area.lte = maxArea;
  }

  if (features.includes('parking'))   where.hasParking   = true;
  if (features.includes('balcony'))   where.hasBalcony   = true;
  if (features.includes('elevator'))  where.hasElevator  = true;
  if (features.includes('furniture')) where.hasFurniture = true;
  if (features.includes('pool'))      where.hasPool      = true;
  if (features.includes('security'))  where.hasSecurity  = true;
  if (features.includes('ac'))        where.hasAC        = true;
  if (features.includes('internet'))  where.hasInternet  = true;
  if (features.includes('gym'))       where.hasGym       = true;

  try {
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings: listings.map(mapDbListing),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}
