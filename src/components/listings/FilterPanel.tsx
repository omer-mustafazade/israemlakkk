'use client';
import { useTranslations } from 'next-intl';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface Filters {
  category: string;
  type: string;
  city: string;
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
  rooms: string;
  features: string[];
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

const CITIES = [
  'Xırdalan', 'Yasamal', 'Binəqədi', 'Nəsimi', 'Nizami',
  'Xətai', 'Suraxanı', 'Sabunçu', 'Sabail', 'Abşeron',
  'Sumqayıt', 'Pirallahı',
];
const PROPERTY_TYPES = ['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL', 'OFFICE'];
const FEATURES = ['parking', 'balcony', 'elevator', 'furniture', 'pool', 'security'];
const ROOM_OPTIONS = ['1', '2', '3', '4', '5+'];

export default function FilterPanel({ filters, onChange, onReset }: Props) {
  const t = useTranslations('filter');

  const update = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  const toggleFeature = (feat: string) => {
    const current = filters.features;
    const next = current.includes(feat) ? current.filter((f) => f !== feat) : [...current, feat];
    onChange({ ...filters, features: next });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 12px',
    fontSize: '0.875rem',
    color: 'var(--color-text-primary)',
    background: 'var(--color-surface)',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
    display: 'block',
  };

  const groupStyle: React.CSSProperties = {
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '1.25rem',
    marginBottom: '1.25rem',
  };

  return (
    <aside
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 90,
        maxHeight: 'calc(100vh - 110px)',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary)' }}>
          <SlidersHorizontal size={18} />
          {t('title')}
        </div>
        <button
          onClick={onReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            fontWeight: 500,
          }}
        >
          <RotateCcw size={13} /> {t('reset')}
        </button>
      </div>

      {/* Category */}
      <div style={groupStyle}>
        <label style={labelStyle}>{t('category')}</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[['', t('allCategories')], ['SALE', t('sale')], ['RENT', t('rent')]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => update('category', val)}
              style={{
                flex: 1,
                padding: '7px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: filters.category === val ? 'var(--color-primary)' : 'var(--color-border)',
                background: filters.category === val ? 'var(--color-primary)' : 'transparent',
                color: filters.category === val ? '#fff' : 'var(--color-text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div style={groupStyle}>
        <label style={labelStyle}>{t('type')}</label>
        <select value={filters.type} onChange={(e) => update('type', e.target.value)} style={inputStyle}>
          <option value="">{t('allTypes')}</option>
          {PROPERTY_TYPES.map((pt) => (
            <option key={pt} value={pt}>{t(pt.toLowerCase() as 'apartment' | 'house' | 'villa' | 'land' | 'commercial' | 'office')}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div style={groupStyle}>
        <label style={labelStyle}>{t('city')}</label>
        <select value={filters.city} onChange={(e) => update('city', e.target.value)} style={inputStyle}>
          <option value="">{t('allCities')}</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Price */}
      <div style={groupStyle}>
        <label style={labelStyle}>{t('priceMin')} – {t('priceMax')} (AZN)</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => update('priceMin', e.target.value)}
            style={{ ...inputStyle, width: '50%' }}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => update('priceMax', e.target.value)}
            style={{ ...inputStyle, width: '50%' }}
          />
        </div>
      </div>

      {/* Area */}
      <div style={groupStyle}>
        <label style={labelStyle}>{t('areaMin')} – {t('areaMax')}</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            placeholder="Min"
            value={filters.areaMin}
            onChange={(e) => update('areaMin', e.target.value)}
            style={{ ...inputStyle, width: '50%' }}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.areaMax}
            onChange={(e) => update('areaMax', e.target.value)}
            style={{ ...inputStyle, width: '50%' }}
          />
        </div>
      </div>

      {/* Rooms */}
      <div style={groupStyle}>
        <label style={labelStyle}>{t('rooms')}</label>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {['', ...ROOM_OPTIONS].map((r) => (
            <button
              key={r}
              onClick={() => update('rooms', r)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: filters.rooms === r ? 'var(--color-primary)' : 'var(--color-border)',
                background: filters.rooms === r ? 'var(--color-primary)' : 'transparent',
                color: filters.rooms === r ? '#fff' : 'var(--color-text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: 36,
              }}
            >
              {r === '' ? '✕' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <label style={labelStyle}>{t('features')}</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {FEATURES.map((feat) => (
            <label
              key={feat}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}
            >
              <input
                type="checkbox"
                checked={filters.features.includes(feat)}
                onChange={() => toggleFeature(feat)}
                style={{ accentColor: 'var(--color-primary)', width: 16, height: 16 }}
              />
              {t(feat as 'parking' | 'balcony' | 'elevator' | 'furniture' | 'pool' | 'security')}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
