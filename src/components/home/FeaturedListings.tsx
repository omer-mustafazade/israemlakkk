'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Listing } from '@/types';
import { fetchListings } from '@/lib/api';
import ListingCard from '@/components/listings/ListingCard';

export default function FeaturedListings() {
  const t = useTranslations('featured');
  const locale = useLocale();
  const [featured, setFeatured] = useState<Listing[]>([]);

  useEffect(() => {
    fetchListings({ featured: 'true', limit: '4' })
      .then((d) => setFeatured(d.listings))
      .catch(() => {});
  }, []);

  return (
    <section className="section">
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(200,146,42,0.12)',
                color: 'var(--color-accent)',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              ★ {t('title')}
            </div>
            <h2 className="section-title">{t('title')}</h2>
            <p className="section-subtitle">{t('subtitle')}</p>
          </div>
          <Link
            href={`/${locale}/listings?featured=true`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-primary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'gap 0.2s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.gap = '10px')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.gap = '6px')}
          >
            {t('viewAll')} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
