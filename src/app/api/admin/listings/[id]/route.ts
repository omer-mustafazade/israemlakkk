import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mapDbListing } from '@/lib/api';
import { requireAdminAuth } from '@/lib/auth';
import {
  sanitizeStr, parsePositiveInt, parsePositiveFloat,
  assertEnum, parseImagesJson, sanitizeId,
  CATEGORY, PROPERTY_TYPE, STATUS, CURRENCY,
} from '@/lib/validate';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  const { id: rawId } = await params;
  const id = sanitizeId(rawId);
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  try {
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(mapDbListing(listing));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  const { id: rawId } = await params;
  const id = sanitizeId(rawId);
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const errors: string[] = [];

  const titleAz = sanitizeStr(body.titleAz, { min: 2, max: 300 });
  const titleTr = sanitizeStr(body.titleTr, { min: 2, max: 300 });
  const titleEn = sanitizeStr(body.titleEn, { max: 300 }) ?? '';
  if (!titleAz) errors.push('titleAz is required (2-300 chars)');
  if (!titleTr) errors.push('titleTr is required (2-300 chars)');

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

  if (errors.length > 0) {
    return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
  }

  try {
    const listing = await prisma.listing.update({
      where: { id },
      data: {
        titleAz: titleAz!, titleTr: titleTr!, titleEn,
        descAz, descTr, descEn,
        category: category!, propertyType: propertyType!,
        status, currency,
        price: price!, area: area!,
        city: city!, district: district!, address,
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
        isNew:        !!body.isNew,
        imagesJson:   imagesJson ?? '[]',
      },
    });
    return NextResponse.json(mapDbListing(listing));
  } catch {
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  const { id: rawId } = await params;
  const id = sanitizeId(rawId);
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  try {
    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}
