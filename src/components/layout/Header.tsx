'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Phone } from 'lucide-react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/listings`, label: t('listings') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Logo */}
        <Link href={`/${locale}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/logo.png"
            alt="İSRA Emlak"
            style={{ height: 48, width: 48, objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
          />
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-primary)', lineHeight: 1.1 }}>
              İSRA
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Emlak
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                textDecoration: 'none',
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
                fontSize: '0.95rem',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LanguageSwitcher />
          <a
            href="tel:+994505780509"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--color-accent)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
            className="phone-btn"
          >
            <Phone size={15} />
            <span className="phone-text">+994 50 578 05 09</span>
          </a>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="burger-btn"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-primary)',
              padding: '4px',
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            background: '#fff',
            borderTop: '1px solid var(--color-border)',
            padding: '1rem 1.5rem',
          }}
          className="mobile-menu"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '0.75rem 0',
                color: 'var(--color-text-primary)',
                textDecoration: 'none',
                fontWeight: 500,
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: '1rem' }}>
            <LanguageSwitcher />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .burger-btn { display: flex !important; }
          .phone-text { display: none; }
        }
      `}</style>
    </header>
  );
}
