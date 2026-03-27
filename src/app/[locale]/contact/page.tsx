'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const PHONE = '+994501234567';
  const PHONE_DISPLAY = '+994 50 123 45 67';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) setSent(true);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    fontSize: '0.95rem',
    color: 'var(--color-text-primary)',
    background: 'var(--color-surface)',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'var(--font-body)',
  };

  return (
    <div style={{ background: 'var(--color-bg)' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', padding: '5rem 0 4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
            {t('title')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem' }}>{t('subtitle')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>

            {/* Form */}
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-success)', marginBottom: '0.5rem' }}>
                    {t('form.success')}
                  </h3>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', message: '' }); }}
                    style={{ marginTop: '1.5rem', background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '8px 18px', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}
                  >
                    {t('form.sendNew')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                      {t('form.name')} *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                      {t('form.phone')} *
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                      {t('form.email')}
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                      {t('form.message')} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                    />
                  </div>
                  {error && (
                    <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '0.875rem', color: '#DC2626' }}>
                      {t('form.error')}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: loading ? 'var(--color-text-muted)' : 'var(--color-primary)',
                      color: '#fff',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '1rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    <Send size={18} />
                    {loading ? t('form.sending') : t('form.send')}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Info card */}
              <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                  {t('title')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { icon: MapPin, label: t('info.address'), value: 'Bakı, Nəsimi rayonu, Nizami küçəsi 45' },
                    { icon: Phone, label: t('info.phone'), value: PHONE_DISPLAY, href: `tel:${PHONE}` },
                    { icon: Mail, label: t('info.email'), value: 'info@israemlak.az', href: 'mailto:info@israemlak.az' },
                    { icon: Clock, label: t('info.hours'), value: t('info.hoursValue') },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} style={{ display: 'flex', gap: '14px' }}>
                        <div style={{ width: 40, height: 40, background: 'rgba(26,60,94,0.08)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={18} color="var(--color-primary)" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                          {item.href ? (
                            <a href={item.href} style={{ color: 'var(--color-text-primary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>{item.value}</a>
                          ) : (
                            <div style={{ color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '0.95rem' }}>{item.value}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${PHONE}?text=${encodeURIComponent('Salam, İSRA Emlak saytından əlaqə saxlayıram.')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: '#25D366',
                  color: '#fff',
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(37,211,102,0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(37,211,102,0.3)';
                }}
              >
                <MessageCircle size={28} />
                <div>
                  <div style={{ fontSize: '1rem' }}>WhatsApp ilə yazın</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>{PHONE_DISPLAY}</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
