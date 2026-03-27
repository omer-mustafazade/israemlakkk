'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Search, Home, Building2 } from 'lucide-react';

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'ALL' | 'SALE' | 'RENT'>('ALL');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (category !== 'ALL') params.set('category', category);
    if (query) params.set('search', query);
    router.push(`/${locale}/listings?${params.toString()}`);
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          transform: 'scale(1.03)',
        }}
      />
      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(26,60,94,0.88) 0%, rgba(26,60,94,0.65) 50%, rgba(26,60,94,0.40) 100%)',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div style={{ maxWidth: 760 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(200,146,42,0.25)',
              border: '1px solid rgba(200,146,42,0.5)',
              color: 'var(--color-accent-light)',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              letterSpacing: '0.05em',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent-light)', display: 'inline-block' }} />
            İSRA Emlak — Bakı, Azərbaycan
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em',
            }}
          >
            {t('title')}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(255,255,255,0.82)',
              marginBottom: '2.5rem',
              lineHeight: 1.7,
              maxWidth: 560,
            }}
          >
            {t('subtitle')}
          </p>

          {/* Search box */}
          <div
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '8px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              maxWidth: 680,
            }}
          >
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', padding: '4px 4px 0' }}>
              {[
                { key: 'ALL', label: t('btnSale') + ' / ' + t('btnRent'), icon: null },
                { key: 'SALE', label: t('btnSale'), icon: <Home size={14} /> },
                { key: 'RENT', label: t('btnRent'), icon: <Building2 size={14} /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setCategory(tab.key as 'ALL' | 'SALE' | 'RENT')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    background: category === tab.key ? 'var(--color-primary)' : 'transparent',
                    color: category === tab.key ? '#fff' : 'var(--color-text-secondary)',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search input row */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '0 16px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}>
                <Search size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: 'var(--color-text-primary)',
                    padding: '14px 0',
                  }}
                />
              </div>
              <button
                onClick={handleSearch}
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 28px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s, transform 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-accent-light)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-accent)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Search size={16} />
                {t('btnSearch')}
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2.5rem' }}>
            {[
              { value: '500+', label: 'Aktiv Elan' },
              { value: '10+', label: 'İl Təcrübə' },
              { value: '1000+', label: 'Müştəri' },
            ].map((stat) => (
              <div key={stat.label} style={{ color: '#fff' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--color-bg)" />
        </svg>
      </div>
    </section>
  );
}
