'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Plus, ImageIcon } from 'lucide-react';

interface ImageEntry {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface FormData {
  titleAz: string; titleTr: string; titleEn: string;
  descAz: string; descTr: string; descEn: string;
  category: string; propertyType: string; status: string;
  price: string; currency: string; area: string;
  city: string; district: string; address: string;
  rooms: string; bathrooms: string; floor: string;
  totalFloors: string; buildYear: string;
  hasParking: boolean; hasBalcony: boolean; hasElevator: boolean;
  hasFurniture: boolean; hasAC: boolean; hasInternet: boolean;
  hasSecurity: boolean; hasPool: boolean; hasGym: boolean;
  isFeatured: boolean; isNew: boolean;
}

const EMPTY_FORM: FormData = {
  titleAz: '', titleTr: '', titleEn: '',
  descAz: '', descTr: '', descEn: '',
  category: 'SALE', propertyType: 'APARTMENT', status: 'ACTIVE',
  price: '', currency: 'AZN', area: '',
  city: '', district: '', address: '',
  rooms: '', bathrooms: '', floor: '', totalFloors: '', buildYear: '',
  hasParking: false, hasBalcony: false, hasElevator: false,
  hasFurniture: false, hasAC: false, hasInternet: false,
  hasSecurity: false, hasPool: false, hasGym: false,
  isFeatured: false, isNew: true,
};

interface Props {
  initialData?: Partial<FormData>;
  initialImages?: ImageEntry[];
  listingId?: string;
}

export default function ListingForm({ initialData, initialImages, listingId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM, ...initialData });
  const [images, setImages] = useState<ImageEntry[]>(initialImages ?? []);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'az' | 'tr' | 'en'>('az');
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
  };

  const addImageByUrl = () => {
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, { url: imageUrl.trim(), alt: '', isPrimary: prev.length === 0 }]);
    setImageUrl('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (res.ok) {
          setImages((prev) => [...prev, { url: data.url, alt: '', isPrimary: prev.length === 0 }]);
        } else {
          setError(data.error ?? 'Şəkil yüklənmədi');
        }
      }
    } catch {
      setError('Şəkil yüklənərkən xəta baş verdi');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (next.length > 0 && !next.some((img) => img.isPrimary)) {
        next[0].isPrimary = true;
      }
      return next;
    });
  };

  const setPrimary = (idx: number) => {
    setImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === idx })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        imagesJson: JSON.stringify(images),
      };
      const url = listingId ? `/api/admin/listings/${listingId}` : '/api/admin/listings';
      const method = listingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Xəta baş verdi');
      }
      router.push('/admin/listings');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta baş verdi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ── Multilingual titles ── */}
      <Section title="Başlıq və Təsvir">
        {/* Language tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: 0 }}>
          {(['az', 'tr', 'en'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveTab(lang)}
              style={{
                padding: '7px 16px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontWeight: activeTab === lang ? 700 : 400,
                color: activeTab === lang ? '#2563eb' : '#6b7280',
                borderBottom: activeTab === lang ? '2px solid #2563eb' : '2px solid transparent',
                marginBottom: -1,
                fontSize: '0.875rem',
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Field label={`Başlıq (${activeTab.toUpperCase()})`} required>
            <input
              type="text"
              value={form[`title${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as keyof FormData] as string}
              onChange={set(`title${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as keyof FormData)}
              required={activeTab === 'az'}
              style={inputStyle}
            />
          </Field>
          <Field label={`Təsvir (${activeTab.toUpperCase()})`}>
            <textarea
              rows={4}
              value={form[`desc${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as keyof FormData] as string}
              onChange={set(`desc${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}` as keyof FormData)}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
            />
          </Field>
        </div>
      </Section>

      {/* ── Core ── */}
      <Section title="Əsas Məlumatlar">
        <div style={gridStyle}>
          <Field label="Kateqoriya" required>
            <select value={form.category} onChange={set('category')} required style={inputStyle}>
              <option value="SALE">Satış</option>
              <option value="RENT">İcarə</option>
            </select>
          </Field>
          <Field label="Əmlak növü" required>
            <select value={form.propertyType} onChange={set('propertyType')} required style={inputStyle}>
              <option value="APARTMENT">Mənzil</option>
              <option value="HOUSE">Ev</option>
              <option value="VILLA">Villa</option>
              <option value="OFFICE">Ofis</option>
              <option value="LAND">Torpaq</option>
              <option value="COMMERCIAL">Kommersiya</option>
            </select>
          </Field>
          <Field label="Status" required>
            <select value={form.status} onChange={set('status')} required style={inputStyle}>
              <option value="ACTIVE">Aktiv</option>
              <option value="SOLD">Satılıb</option>
              <option value="RENTED">İcarəyə verilib</option>
              <option value="ARCHIVED">Arxiv</option>
            </select>
          </Field>
          <Field label="Qiymət" required>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="number"
                value={form.price}
                onChange={set('price')}
                required
                min={0}
                placeholder="0"
                style={{ ...inputStyle, flex: 1 }}
              />
              <select value={form.currency} onChange={set('currency')} style={{ ...inputStyle, width: 80 }}>
                <option value="AZN">AZN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </Field>
          <Field label="Sahə (m²)" required>
            <input type="number" value={form.area} onChange={set('area')} required min={0} placeholder="0" style={inputStyle} />
          </Field>
        </div>
      </Section>

      {/* ── Location ── */}
      <Section title="Yer">
        <div style={gridStyle}>
          <Field label="Şəhər" required>
            <input type="text" value={form.city} onChange={set('city')} required style={inputStyle} />
          </Field>
          <Field label="Rayon" required>
            <input type="text" value={form.district} onChange={set('district')} required style={inputStyle} />
          </Field>
          <Field label="Ünvan">
            <input type="text" value={form.address} onChange={set('address')} style={inputStyle} />
          </Field>
        </div>
      </Section>

      {/* ── Details ── */}
      <Section title="Detallar">
        <div style={gridStyle}>
          <Field label="Otaq sayı">
            <input type="number" value={form.rooms} onChange={set('rooms')} min={0} style={inputStyle} />
          </Field>
          <Field label="Vanna otağı">
            <input type="number" value={form.bathrooms} onChange={set('bathrooms')} min={0} style={inputStyle} />
          </Field>
          <Field label="Mərtəbə">
            <input type="number" value={form.floor} onChange={set('floor')} min={0} style={inputStyle} />
          </Field>
          <Field label="Ümumi mərtəbə">
            <input type="number" value={form.totalFloors} onChange={set('totalFloors')} min={0} style={inputStyle} />
          </Field>
          <Field label="Tikinti ili">
            <input type="number" value={form.buildYear} onChange={set('buildYear')} min={1900} max={2030} style={inputStyle} />
          </Field>
        </div>
      </Section>

      {/* ── Features ── */}
      <Section title="Xüsusiyyətlər">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {FEATURES.map(({ key, label }) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }}>
              <input
                type="checkbox"
                checked={form[key as keyof FormData] as boolean}
                onChange={set(key as keyof FormData)}
                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#2563eb' }}
              />
              {label}
            </label>
          ))}
        </div>
      </Section>

      {/* ── Flags ── */}
      <Section title="Flags">
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }}>
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={set('isFeatured')}
              style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#f59e0b' }}
            />
            Öne çıxarılmış (Featured)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#374151' }}>
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={set('isNew')}
              style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#16a34a' }}
            />
            Yeni elan
          </label>
        </div>
      </Section>

      {/* ── Images ── */}
      <Section title="Şəkillər">
        {/* Upload file */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              border: '1px dashed #d1d5db',
              borderRadius: 8,
              background: '#f9fafb',
              cursor: uploading ? 'wait' : 'pointer',
              fontSize: '0.875rem',
              color: '#374151',
            }}
          >
            <Upload size={15} />
            {uploading ? 'Yüklənir...' : 'Fayl seç'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />

          {/* Or URL */}
          <div style={{ display: 'flex', gap: 6, flex: 1, minWidth: 240 }}>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... şəkil URL-i"
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageByUrl())}
            />
            <button
              type="button"
              onClick={addImageByUrl}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '8px 12px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              <Plus size={14} />
              Əlavə et
            </button>
          </div>
        </div>

        {/* Image grid */}
        {images.length > 0 ? (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  width: 100,
                  height: 80,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: img.isPrimary ? '2px solid #2563eb' : '2px solid #e5e7eb',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                onClick={() => setPrimary(idx)}
                title="Əsas şəkil et"
              >
                <img src={img.url} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {img.isPrimary && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: '#2563eb',
                      color: '#fff',
                      fontSize: '0.6rem',
                      textAlign: 'center',
                      padding: '2px 0',
                      fontWeight: 700,
                    }}
                  >
                    ANA
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    borderRadius: 4,
                    color: '#fff',
                    cursor: 'pointer',
                    padding: 2,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              border: '1px dashed #d1d5db',
              borderRadius: 8,
              padding: '1.5rem',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '0.875rem',
            }}
          >
            <ImageIcon size={24} style={{ margin: '0 auto 8px' }} />
            Hələ şəkil əlavə edilməyib
          </div>
        )}
        <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 8 }}>
          Əsas şəklə klikləyərək dəyişdirin. Mavi çərçivəli şəkil ana şəkildir.
        </p>
      </Section>

      {/* Error */}
      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 8,
            padding: '10px 14px',
            color: '#dc2626',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            background: saving ? '#93c5fd' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '11px 24px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saxlanılır...' : listingId ? 'Yadda saxla' : 'Elan yarat'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: 8,
            padding: '11px 20px',
            fontWeight: 500,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          Ləğv et
        </button>
      </div>
    </form>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        marginBottom: '1.25rem',
      }}
    >
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#6b7280',
          marginBottom: 5,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: '0.875rem',
  outline: 'none',
  color: '#111827',
  background: '#fff',
  boxSizing: 'border-box',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '1rem',
};

const FEATURES = [
  { key: 'hasParking', label: 'Otopark' },
  { key: 'hasBalcony', label: 'Balkon' },
  { key: 'hasElevator', label: 'Lift' },
  { key: 'hasFurniture', label: 'Mebel' },
  { key: 'hasAC', label: 'Kondisioner' },
  { key: 'hasInternet', label: 'İnternet' },
  { key: 'hasSecurity', label: 'Mühafizə' },
  { key: 'hasPool', label: 'Hovuz' },
  { key: 'hasGym', label: 'Fitnes' },
];
