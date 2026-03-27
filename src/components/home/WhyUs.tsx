'use client';
import { useTranslations } from 'next-intl';
import { Shield, Zap, Star } from 'lucide-react';

const FEATURES = [
  { key: 'trust', icon: Shield, color: '#1A3C5E' },
  { key: 'speed', icon: Zap, color: '#C8922A' },
  { key: 'professional', icon: Star, color: '#16A34A' },
];

export default function WhyUs() {
  const t = useTranslations('whyUs');

  return (
    <section className="section-alt">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0', textAlign: 'center' }}>
            {t('subtitle')}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.key}
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.25rem 2rem',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  border: '1px solid var(--color-border)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)';
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 'var(--radius-md)',
                    background: `${feature.color}15`,
                    border: `1px solid ${feature.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={28} color={feature.color} />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {t(`${feature.key}.title` as 'trust.title' | 'speed.title' | 'professional.title')}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                  {t(`${feature.key}.desc` as 'trust.desc' | 'speed.desc' | 'professional.desc')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
