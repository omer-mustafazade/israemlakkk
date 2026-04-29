'use client';
import { useTranslations, useLocale } from 'next-intl';
import { Rocket, BadgeCheck, HeartHandshake, Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PHONE = '+994105050343';
const PHONE_DISPLAY = '+994 10 505 03 43';

const BENEFITS = [
  { key: 'benefit1', icon: Rocket, color: '#C8922A' },
  { key: 'benefit2', icon: BadgeCheck, color: '#16A34A' },
  { key: 'benefit3', icon: HeartHandshake, color: '#1A3C5E' },
];

export default function SellWithUs() {
  const t = useTranslations('sellWithUs');
  const locale = useLocale();
  const whatsappMsg = encodeURIComponent(
    locale === 'az'
      ? 'Salam, mülkümü satmaq istəyirəm. Məlumat almaq istəyirəm.'
      : locale === 'tr'
      ? 'Merhaba, mülkümü satmak istiyorum. Bilgi almak istiyorum.'
      : 'Hello, I want to sell my property. I would like to get information.'
  );

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #0d2540 100%)',
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative shapes */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(200,146,42,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '0.75rem',
            }}
          >
            {t('title')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', maxWidth: 540, margin: '0 auto' }}>
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Benefit cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.key}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem 1.75rem',
                  backdropFilter: 'blur(6px)',
                  transition: 'background 0.25s, transform 0.25s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--radius-md)',
                    background: `${b.color}25`,
                    border: `1px solid ${b.color}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Icon size={26} color={b.color} />
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: '#fff',
                    marginBottom: '0.5rem',
                  }}
                >
                  {t(`${b.key}` as 'benefit1' | 'benefit2' | 'benefit3')}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {t(`${b.key}Desc` as 'benefit1Desc' | 'benefit2Desc' | 'benefit3Desc')}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}
        >
          <a
            href={`tel:${PHONE}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--color-accent)',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(200,146,42,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(200,146,42,0.5)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(200,146,42,0.4)';
            }}
          >
            <Phone size={20} />
            {PHONE_DISPLAY}
          </a>

          <a
            href={`https://wa.me/${PHONE}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#25D366',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(37,211,102,0.45)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(37,211,102,0.3)';
            }}
          >
            <MessageCircle size={20} />
            {t('ctaWhatsApp')}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
