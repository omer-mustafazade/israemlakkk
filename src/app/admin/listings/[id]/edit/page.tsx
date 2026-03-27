'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { use } from 'react';
import ListingForm from '../../_form/ListingForm';
import { Listing } from '@/types';

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/listings/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => { if (data) setListing(data); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: '#6b7280' }}>Yüklənir...</div>
    );
  }
  if (notFound || !listing) {
    return (
      <div style={{ padding: '2rem', color: '#ef4444' }}>Elan tapılmadı.</div>
    );
  }

  const initialData = {
    titleAz: listing.titleAz,
    titleTr: listing.titleTr,
    titleEn: listing.titleEn,
    descAz: listing.descriptionAz,
    descTr: listing.descriptionTr,
    descEn: listing.descriptionEn,
    category: listing.category,
    propertyType: listing.propertyType,
    status: listing.status,
    price: String(listing.price),
    currency: listing.currency,
    area: String(listing.area),
    city: listing.city,
    district: listing.district,
    address: listing.address ?? '',
    rooms: listing.rooms !== undefined ? String(listing.rooms) : '',
    bathrooms: listing.bathrooms !== undefined ? String(listing.bathrooms) : '',
    floor: listing.floor !== undefined ? String(listing.floor) : '',
    totalFloors: listing.totalFloors !== undefined ? String(listing.totalFloors) : '',
    buildYear: listing.buildYear !== undefined ? String(listing.buildYear) : '',
    hasParking: listing.hasParking,
    hasBalcony: listing.hasBalcony,
    hasElevator: listing.hasElevator,
    hasFurniture: listing.hasFurniture,
    hasAC: listing.hasAC,
    hasInternet: listing.hasInternet,
    hasSecurity: listing.hasSecurity,
    hasPool: listing.hasPool,
    hasGym: listing.hasGym,
    isFeatured: listing.isFeatured,
    isNew: listing.isNew,
  };

  const initialImages = listing.images.map((img) => ({
    url: img.url,
    alt: img.alt ?? '',
    isPrimary: img.isPrimary,
  }));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
        <Link
          href="/admin/listings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          <ChevronLeft size={16} />
          Geri
        </Link>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827' }}>
          Elanı düzəlt
        </h1>
      </div>
      <ListingForm initialData={initialData} initialImages={initialImages} listingId={id} />
    </div>
  );
}
