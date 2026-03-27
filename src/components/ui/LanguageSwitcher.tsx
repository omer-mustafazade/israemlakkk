'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

const LANGUAGES = [
  { code: 'az', label: 'AZE' },
  { code: 'tr', label: 'TÜR' },
  { code: 'en', label: 'ENG' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        background: 'var(--color-surface-alt)',
        border: '1px solid var(--color-border)',
        borderRadius: '999px',
        padding: '3px',
      }}
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLocale(lang.code)}
          style={{
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: locale === lang.code ? 'var(--color-primary)' : 'transparent',
            color: locale === lang.code ? '#fff' : 'var(--color-text-secondary)',
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
