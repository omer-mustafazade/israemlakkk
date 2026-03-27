import { useTranslations } from 'next-intl';
import { Building2, Award, Users, MapPin } from 'lucide-react';

const STATS = [
  { key: 'listings', value: '500+', icon: Building2 },
  { key: 'experience', value: '10+', icon: Award },
  { key: 'clients', value: '1000+', icon: Users },
  { key: 'cities', value: '5+', icon: MapPin },
];

export default function StatsSection() {
  const t = useTranslations('stats');

  return (
    <section
      style={{
        background: 'var(--color-primary)',
        padding: '4rem 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
          }}
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '0.75rem',
                }}
              >
                <div
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
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                  {t(stat.key as 'listings' | 'experience' | 'clients' | 'cities')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
