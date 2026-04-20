import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mapDbListing } from '@/lib/api';
import { requireAdminAuth } from '@/lib/auth';
import {
  sanitizeStr, parsePositiveInt, parsePositiveFloat,
  assertEnum, parseImagesJson,
  CATEGORY, PROPERTY_TYPE, STATUS, CURRENCY,
} from '@/lib/validate';

export async function GET(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  const sp = req.nextUrl.searchParams;
  const page   = parsePositiveInt(sp.get('page'),  { min: 1, max: 10_000 }) ?? 1;
  const limit  = parsePositiveInt(sp.get('limit'), { min: 1, max: 100    }) ?? 20;
  const skip   = (page - 1) * limit;
  const search = sanitizeStr(sp.get('search'), { max: 200 }) ?? '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (search) {
    where.OR = [
      { titleAz: { contains: search } },
      { titleTr: { contains: search } },
      { city:    { contains: search } },
    ];
  }

  try {
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
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

function parseListing(body: Record<string, unknown>) {
  const errors: string[] = [];

  const titleAz = sanitizeStr(body.titleAz, { min: 2, max: 300 });
  const titleTr = sanitizeStr(body.titleTr, { min: 0, max: 300 }) ?? '';
  const titleEn = sanitizeStr(body.titleEn, { min: 0, max: 300 }) ?? '';

  if (!titleAz) errors.push('titleAz is required (2-300 chars)');

  const descAz = sanitizeStr(body.descAz, { max: 8000 }) ?? '';
  const descTr = sanitizeStr(body.descTr, { max: 8000 }) ?? '';
  const descEn = sanitizeStr(body.descEn, { max: 8000 }) ?? '';

  const category = assertEnum(body.category, CATEGORY);
  if (!category) errors.push('category must be SALE or RENT');

  const propertyType = assertEnum(body.propertyType, PROPERTY_TYPE);
  if (!propertyType) errors.push('propertyType is invalid');

  const status   = assertEnum(body.status,   STATUS)   ?? 'ACTIVE';
  const currency = assertEnum(body.currency, CURRENCY) ?? 'AZN';

  const price = parsePositiveFloat(body.price, { min: 0, max: 1_000_000_000 });
  if (price === null) errors.push('price must be a valid positive number');

  const area = parsePositiveFloat(body.area, { min: 0, max: 999_999 });
  if (area === null) errors.push('area must be a valid positive number');

  const city     = sanitizeStr(body.city,     { min: 2, max: 100 });
  const district = sanitizeStr(body.district, { min: 2, max: 100 });
  if (!city)     errors.push('city is required (2-100 chars)');
  if (!district) errors.push('district is required (2-100 chars)');

  const address = sanitizeStr(body.address, { max: 500 }) ?? null;

  const rooms       = parsePositiveInt(body.rooms,       { min: 1, max: 99 });
  const bathrooms   = parsePositiveInt(body.bathrooms,   { min: 1, max: 99 });
  const floor       = parsePositiveInt(body.floor,       { min: 0, max: 999 });
  const totalFloors = parsePositiveInt(body.totalFloors, { min: 1, max: 999 });
  const buildYear   = parsePositiveInt(body.buildYear,   { min: 1800, max: new Date().getFullYear() + 5 });

  const imagesJson = parseImagesJson(body.imagesJson);
  if (imagesJson === null) errors.push('imagesJson is malformed or too large');

  return {
    valid: errors.length === 0,
    errors,
    data: {
      titleAz: titleAz ?? '', titleTr, titleEn,
      descAz, descTr, descEn,
      category: category ?? 'SALE', propertyType: propertyType ?? 'APARTMENT',
      status, currency,
      price: price ?? 0, area: area ?? 0,
      city: city ?? '', district: district ?? '', address,
      rooms: rooms ?? null, bathrooms: bathrooms ?? null,
      floor: floor ?? null, totalFloors: totalFloors ?? null,
      buildYear: buildYear ?? null,
      hasParking:   !!body.hasParking,
      hasBalcony:   !!body.hasBalcony,
      hasElevator:  !!body.hasElevator,
      hasFurniture: !!body.hasFurniture,
      hasAC:        !!body.hasAC,
      hasInternet:  !!body.hasInternet,
      hasSecurity:  !!body.hasSecurity,
      hasPool:      !!body.hasPool,
      hasGym:       !!body.hasGym,
      isFeatured:   !!body.isFeatured,
      isNew:        body.isNew !== undefined ? !!body.isNew : true,
      imagesJson:   imagesJson ?? '[]',
    },
  };
}

export async function POST(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { valid, errors, data } = parseListing(body);
  if (!valid) {
    return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
  }

  try {
    const listing = await prisma.listing.create({ data });
    return NextResponse.json(mapDbListing(listing), { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
