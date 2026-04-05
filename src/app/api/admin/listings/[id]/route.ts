import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mapDbListing } from '@/lib/api';
import { requireAdminAuth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;
  const { id } = await params;
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
  const { id } = await params;
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

    const listing = await prisma.listing.update({
      where: { id },
      data: {
        titleAz, titleTr, titleEn,
        descAz: descAz ?? '', descTr: descTr ?? '', descEn: descEn ?? '',
        category, propertyType, status,
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
        isNew: !!isNew,
        imagesJson: imagesJson ?? '[]',
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
  const { id } = await params;
  try {
    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}
