'use client';
import { useTranslations } from 'next-intl';
import { Phone, MessageCircle } from 'lucide-react';

const PHONE = '+994105050343';
const PHONE_DISPLAY = '+994 10 505 03 43';

export default function ContactCTA() {
  const t = useTranslations('cta');

  const whatsappMsg = encodeURIComponent('Salam, İSRA Emlak saytından əlaqə saxlayıram.');

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, var(--color-accent) 0%, #a07020 100%)',
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
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
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', marginBottom: '2.5rem' }}>
          {t('subtitle')}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a
            href={`tel:${PHONE}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#fff',
              color: 'var(--color-accent)',
              padding: '14px 32px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
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
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
            }}
          >
            <MessageCircle size={20} />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
