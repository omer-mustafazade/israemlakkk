'use client';
import { useTranslations } from 'next-intl';
import { Shield, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURES = [
  { key: 'trust', icon: Shield, color: '#1A3C5E' },
  { key: 'speed', icon: Zap, color: '#C8922A' },
  { key: 'professional', icon: Star, color: '#16A34A' },
];

function TiltCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-6px)`;
    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
    e.currentTarget.style.boxShadow = 'var(--shadow-card)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.25rem 2rem',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        border: '1px solid var(--color-border)',
        willChange: 'transform',
        cursor: 'default',
      }}
    >
      {children}
    </motion.div>
  );
}

export default function WhyUs() {
  const t = useTranslations('whyUs');

  return (
    <section className="section-alt">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0', textAlign: 'center' }}>
            {t('subtitle')}
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <TiltCard key={feature.key} delay={i * 0.12}>
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
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
