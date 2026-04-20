'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
        </motion.div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {featured.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: 'easeOut' }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <ListingCard listing={listing} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
