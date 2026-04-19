import { useTranslations } from 'next-intl';
import { Award, Users, Shield, Zap } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');

  const values = [
    { icon: Shield, titleKey: 'val1Title', descKey: 'val1Desc' },
    { icon: Zap,    titleKey: 'val2Title', descKey: 'val2Desc' },
    { icon: Award,  titleKey: 'val3Title', descKey: 'val3Desc' },
    { icon: Users,  titleKey: 'val4Title', descKey: 'val4Desc' },
  ];

  const team = [
    { name: 'İsmi Şiraz',     roleAz: 'Baş müdür',       roleTr: 'Genel Müdür',       roleEn: 'General Manager'   },
    { name: 'Cəfər Qurbanov', roleAz: 'Yardımcı müdür',  roleTr: 'Yardımcı Müdür',   roleEn: 'Deputy Manager'    },
    { name: 'Nicat Əbilov',   roleAz: 'Tanıtımcı',       roleTr: 'Tanıtımcı',         roleEn: 'Marketing Agent'   },
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                {[t('missionStat1'), t('missionStat2'), t('missionStat3')].map((s) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(26,60,94,0.06)', border: '1px solid rgba(26,60,94,0.12)', borderRadius: '999px', padding: '6px 14px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0, display: 'inline-block' }} />
                    {s}
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
                <div key={v.titleKey} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, background: 'rgba(26,60,94,0.08)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Icon size={26} color="var(--color-primary)" />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{t(v.titleKey as 'val1Title' | 'val2Title' | 'val3Title' | 'val4Title')}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{t(v.descKey as 'val1Desc' | 'val2Desc' | 'val3Desc' | 'val4Desc')}</p>
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
            {team.map((member) => {
              const initials = member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div key={member.name} style={{ textAlign: 'center', flex: '0 1 200px' }}>
                  <div
                    style={{
                      width: 100, height: 100, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                      border: '3px solid var(--color-accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 1rem',
                      fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: '#fff',
                    }}
                  >
                    {initials}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)' }}>{member.name}</h3>
                  <p style={{ color: 'var(--color-accent)', fontSize: '0.82rem', fontWeight: 600, marginTop: '4px' }}>{member.roleAz}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
