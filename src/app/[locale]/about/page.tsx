import { useTranslations } from 'next-intl';
import { Award, Users, Building2, Shield } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');

  const values = [
    { icon: Shield, title: 'Etibarlılıq', desc: 'Hər müştəriyə dürüstlük və şəffaflıqla yanaşırıq.' },
    { icon: Award, title: 'Keyfiyyət', desc: 'Ən yüksək keyfiyyət standartlarına riayət edirik.' },
    { icon: Users, title: 'Müştəri məmnuniyyəti', desc: 'Müştərinin razılığı bizim üçün ən vacib göstəricidir.' },
    { icon: Building2, title: 'Peşəkarlıq', desc: '10 illik təcrübəmiz ilə hər addımda yanınızdayıq.' },
  ];

  const team = [
    { name: 'Nicat Əliyev', role: 'Baş Direktor', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80' },
    { name: 'Leyla Həsənova', role: 'Satış Meneceri', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80' },
    { name: 'Murad Quliyev', role: 'Daşınmaz Əmlak Agenti', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80' },
  ];

  return (
    <div style={{ background: 'var(--color-bg)' }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
          padding: '6rem 0 5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(200,146,42,0.12)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            {t('title')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto' }}>
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Story + Mission */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <h2 className="section-title">{t('story')}</h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginTop: '1rem', fontSize: '0.97rem' }}>
                {t('storyText')}
              </p>
            </div>
            <div
              style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                {t('mission')}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '0.97rem' }}>
                {t('missionText')}
              </p>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                {[{ v: '500+', l: 'Elan' }, { v: '10+', l: 'İl' }, { v: '1000+', l: 'Müştəri' }].map((s) => (
                  <div key={s.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-accent)' }}>{s.v}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-alt">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">{t('values')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, background: 'rgba(26,60,94,0.08)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Icon size={26} color="var(--color-primary)" />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{v.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">{t('team')}</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
            {team.map((member) => (
              <div key={member.name} style={{ textAlign: 'center', flex: '0 1 220px' }}>
                <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem', border: '3px solid var(--color-accent)' }}>
                  <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)' }}>{member.name}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
