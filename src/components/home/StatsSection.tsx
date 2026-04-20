'use client';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Zap, Award, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

const VALUES = [
  {
    icon: ShieldCheck,
    titleKey: 'val1Title',
    descKey: 'val1Desc',
  },
  {
    icon: Zap,
    titleKey: 'val2Title',
    descKey: 'val2Desc',
  },
  {
    icon: Award,
    titleKey: 'val3Title',
    descKey: 'val3Desc',
  },
  {
    icon: HeartHandshake,
    titleKey: 'val4Title',
    descKey: 'val4Desc',
  },
];

export default function StatsSection() {
  const t = useTranslations('values');

  return (
    <section style={{ background: 'var(--color-primary)', padding: '4rem 0' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
          }}
        >
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: 'easeOut' }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <motion.div
                  whileHover={{ rotateY: 360 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{
                    width: 56,
                    height: 56,
                    background: 'rgba(200,146,42,0.2)',
                    border: '1px solid rgba(200,146,42,0.4)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={24} color="var(--color-accent-light)" />
                </motion.div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                  {t(v.titleKey as 'val1Title' | 'val2Title' | 'val3Title' | 'val4Title')}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                  {t(v.descKey as 'val1Desc' | 'val2Desc' | 'val3Desc' | 'val4Desc')}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
