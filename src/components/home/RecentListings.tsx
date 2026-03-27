'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Listing } from '@/types';
import { fetchListings } from '@/lib/api';
import ListingCard from '@/components/listings/ListingCard';

export default function RecentListings() {
  const t = useTranslations('recent');
  const locale = useLocale();
  const [recent, setRecent] = useState<Listing[]>([]);

  useEffect(() => {
    fetchListings({ sortBy: 'createdAt', sortOrder: 'desc', limit: '6' })
      .then((d) => setRecent(d.listings))
      .catch(() => {});
  }, []);

  return (
    <section className="section-alt">
      <div className="container">
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
            <h2 className="section-title">{t('title')}</h2>
            <p className="section-subtitle">{t('subtitle')}</p>
          </div>
          <Link
            href={`/${locale}/listings`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-primary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            {t('viewAll')} <ArrowRight size={16} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {recent.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
