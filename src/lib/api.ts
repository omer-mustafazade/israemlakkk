import { Listing } from '@/types';

// Maps a raw DB row (from Prisma) to the UI Listing type.
// Prisma schema uses descAz/Tr/En and imagesJson; UI types use descriptionAz/Tr/En and images[].
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDbListing(row: any): Listing {
  const images = (() => {
    try {
      const parsed = JSON.parse(row.imagesJson ?? '[]');
      return parsed.map((img: { url: string; alt?: string; isPrimary?: boolean }, i: number) => ({
        id: `${row.id}-img-${i}`,
        url: img.url,
        alt: img.alt ?? '',
        isPrimary: img.isPrimary ?? i === 0,
        order: i,
      }));
    } catch {
      return [];
    }
  })();

  return {
    id: row.id,
    titleAz: row.titleAz,
    titleTr: row.titleTr,
    titleEn: row.titleEn,
    descriptionAz: row.descAz ?? '',
    descriptionTr: row.descTr ?? '',
    descriptionEn: row.descEn ?? '',
    price: row.price,
    currency: row.currency,
    category: row.category,
    propertyType: row.propertyType,
    status: row.status,
    isFeatured: row.isFeatured,
    isNew: row.isNew,
    city: row.city,
    district: row.district,
    address: row.address ?? undefined,
    area: row.area,
    rooms: row.rooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    floor: row.floor ?? undefined,
    totalFloors: row.totalFloors ?? undefined,
    buildYear: row.buildYear ?? undefined,
    hasParking: row.hasParking,
    hasGarage: false,
    hasBalcony: row.hasBalcony,
    hasElevator: row.hasElevator,
    hasFurniture: row.hasFurniture,
    hasAC: row.hasAC,
    hasHeating: false,
    hasInternet: row.hasInternet,
    hasSecurity: row.hasSecurity,
    hasPool: row.hasPool,
    hasGym: row.hasGym,
    images,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : row.updatedAt,
    viewCount: row.viewCount,
  };
}

// ─── Client-side fetch helpers ────────────────────────────────────────────────

export interface ListingsResponse {
  listings: Listing[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export async function fetchListings(params: Record<string, string> = {}): Promise<ListingsResponse> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/listings${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch listings');
  return res.json();
}

export async function fetchListing(id: string): Promise<Listing> {
  const res = await fetch(`/api/listings/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Listing not found');
  const row = await res.json();
  return mapDbListing(row);
}
