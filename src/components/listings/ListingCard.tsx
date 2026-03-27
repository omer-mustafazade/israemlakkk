'use client';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { MapPin, BedDouble, Bath, Maximize2, Layers } from 'lucide-react';
import { Listing } from '@/types';
import { getListingTitle, getPrimaryImage, formatPrice } from '@/lib/mockData';

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const locale = useLocale();
  const t = useTranslations('listing');
  const title = getListingTitle(listing, locale);
  const image = getPrimaryImage(listing);

  return (
    <Link
      href={`/${locale}/listings/${listing.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <article
        className="card"
        style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Image */}
        <div style={{ position: 'relative', paddingBottom: '62%', overflow: 'hidden' }}>
          <img
            src={image}
            alt={title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          {/* Badges */}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
            <span className={`badge ${listing.category === 'SALE' ? 'badge-sale' : 'badge-rent'}`}>
              {listing.category === 'SALE' ? t('sale') : t('rent')}
            </span>
            {listing.isNew && <span className="badge badge-new">{t('new')}</span>}
            {listing.isFeatured && <span className="badge badge-featured">{t('featured')}</span>}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {/* Price */}
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--color-accent)',
              lineHeight: 1,
            }}
          >
            {formatPrice(listing.price, listing.currency)}
            {listing.category === 'RENT' && (
              <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', marginLeft: 4 }}>
                /ay
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.98rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </h3>

          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            <MapPin size={13} style={{ flexShrink: 0 }} />
            {listing.district}, {listing.city}
          </div>

          {/* Specs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginTop: 'auto',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 500,
            }}
          >
            {listing.rooms && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <BedDouble size={13} /> {listing.rooms} {t('rooms')}
              </span>
            )}
            {listing.bathrooms && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Bath size={13} /> {listing.bathrooms}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Maximize2 size={13} /> {listing.area} {t('area')}
            </span>
            {listing.floor && listing.totalFloors && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Layers size={13} /> {listing.floor}/{listing.totalFloors}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
