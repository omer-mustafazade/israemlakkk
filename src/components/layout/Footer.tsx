'use client';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const contact = useTranslations('contact.info');
  const locale = useLocale();

  return (
    <footer
      style={{
        background: 'var(--color-primary)',
        color: 'var(--color-text-on-dark)',
        paddingTop: '4rem',
        paddingBottom: '2rem',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: 'var(--color-accent)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}
              >
                İ
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem' }}>İSRA Emlak</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              {t('description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem' }}>{t('quickLinks')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { href: `/${locale}`, label: nav('home') },
                { href: `/${locale}/listings`, label: nav('listings') },
                { href: `/${locale}/listings?category=SALE`, label: nav('sale') },
                { href: `/${locale}/listings?category=RENT`, label: nav('rent') },
                { href: `/${locale}/about`, label: nav('about') },
                { href: `/${locale}/contact`, label: nav('contact') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem' }}>{t('contact')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                <MapPin size={16} style={{ marginTop: 2, flexShrink: 0, color: 'var(--color-accent-light)' }} />
                Bakı, Nəsimi rayonu, Nizami küçəsi 45
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                <Phone size={16} style={{ flexShrink: 0, color: 'var(--color-accent-light)' }} />
                <a href="tel:+994501234567" style={{ color: 'inherit', textDecoration: 'none' }}>+994 50 123 45 67</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                <Mail size={16} style={{ flexShrink: 0, color: 'var(--color-accent-light)' }} />
                <a href="mailto:info@israemlak.az" style={{ color: 'inherit', textDecoration: 'none' }}>info@israemlak.az</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                <Clock size={16} style={{ flexShrink: 0, color: 'var(--color-accent-light)' }} />
                {contact('hoursValue')}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.85rem',
          }}
        >
          <span>© {new Date().getFullYear()} İSRA Emlak. {t('rights')}.</span>
        </div>
      </div>
    </footer>
  );
}
