import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mapDbListing } from '@/lib/api';
import { requireAdminAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const skip = (page - 1) * limit;
  const search = searchParams.get('search') ?? '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (search) {
    where.OR = [
      { titleAz: { contains: search } },
      { titleTr: { contains: search } },
      { city: { contains: search } },
    ];
  }

  try {
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
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

export async function POST(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;
  try {
    const body = await req.json();
    const {
      titleAz, titleTr, titleEn,
      descAz, descTr, descEn,
      category, propertyType, status,
      price, currency, area,
      city, district, address,
      rooms, bathrooms, floor, totalFloors, buildYear,
      hasParking, hasBalcony, hasElevator, hasFurniture,
      hasAC, hasInternet, hasSecurity, hasPool, hasGym,
      isFeatured, isNew,
      imagesJson,
    } = body;

    const listing = await prisma.listing.create({
      data: {
        titleAz, titleTr, titleEn,
        descAz: descAz ?? '', descTr: descTr ?? '', descEn: descEn ?? '',
        category, propertyType,
        status: status ?? 'ACTIVE',
        price: parseFloat(price),
        currency: currency ?? 'AZN',
        area: parseFloat(area),
        city, district,
        address: address ?? null,
        rooms: rooms ? parseInt(rooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        floor: floor ? parseInt(floor) : null,
        totalFloors: totalFloors ? parseInt(totalFloors) : null,
        buildYear: buildYear ? parseInt(buildYear) : null,
        hasParking: !!hasParking,
        hasBalcony: !!hasBalcony,
        hasElevator: !!hasElevator,
        hasFurniture: !!hasFurniture,
        hasAC: !!hasAC,
        hasInternet: !!hasInternet,
        hasSecurity: !!hasSecurity,
        hasPool: !!hasPool,
        hasGym: !!hasGym,
        isFeatured: !!isFeatured,
        isNew: isNew !== undefined ? !!isNew : true,
        imagesJson: imagesJson ?? '[]',
      },
    });

    return NextResponse.json(mapDbListing(listing), { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
