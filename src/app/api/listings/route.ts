import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mapDbListing } from '@/lib/api';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const category = searchParams.get('category');
  const propertyType = searchParams.get('propertyType');
  const city = searchParams.get('city');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minArea = searchParams.get('minArea');
  const maxArea = searchParams.get('maxArea');
  const rooms = searchParams.get('rooms');
  const minRooms = searchParams.get('minRooms');
  const isFeatured = searchParams.get('featured');
  const features = searchParams.get('features');
  const sortBy = searchParams.get('sortBy') ?? 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') ?? 'desc') as 'asc' | 'desc';
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '12');
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { status: 'ACTIVE' };

  if (category) where.category = category;
  if (propertyType) where.propertyType = propertyType;
  if (city) where.city = { contains: city };
  if (isFeatured === 'true') where.isFeatured = true;
  if (rooms) where.rooms = parseInt(rooms);
  if (minRooms) where.rooms = { gte: parseInt(minRooms) };

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }
  if (minArea || maxArea) {
    where.area = {};
    if (minArea) where.area.gte = parseFloat(minArea);
    if (maxArea) where.area.lte = parseFloat(maxArea);
  }

  if (features) {
    const featList = features.split(',');
    if (featList.includes('parking')) where.hasParking = true;
    if (featList.includes('balcony')) where.hasBalcony = true;
    if (featList.includes('elevator')) where.hasElevator = true;
    if (featList.includes('furniture')) where.hasFurniture = true;
    if (featList.includes('pool')) where.hasPool = true;
    if (featList.includes('security')) where.hasSecurity = true;
  }

  const validSortFields = ['price', 'area', 'createdAt', 'viewCount'];
  const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

  try {
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: { [orderField]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings: listings.map(mapDbListing),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}
