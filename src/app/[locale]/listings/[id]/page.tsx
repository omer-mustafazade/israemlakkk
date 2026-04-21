'use client';
import { use, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  MapPin, BedDouble, Bath, Maximize2, Layers, Calendar,
  Phone, MessageCircle, ChevronLeft, ChevronRight,
  Car, Wind, Wifi, Shield, Waves, Dumbbell, Sofa,
  Check, Eye, Heart
} from 'lucide-react';
import { Listing } from '@/types';
import { fetchListing, fetchListings } from '@/lib/api';
import { formatPrice } from '@/lib/mockData';
import ListingCard from '@/components/listings/ListingCard';
import { useFavorites } from '@/hooks/useFavorites';

const ListingMap = dynamic(() => import('@/components/listings/ListingMap'), { ssr: false });

function getTitle(listing: Listing, locale: string) {
  if (locale === 'tr') return listing.titleTr;
  if (locale === 'en') return listing.titleEn;
  return listing.titleAz;
}
function getDesc(listing: Listing, locale: string) {
  if (locale === 'tr') return listing.descriptionTr;
  if (locale === 'en') return listing.descriptionEn;
  return listing.descriptionAz;
}

export default function ListingDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = use(params);
  const locale = useLocale();
  const t = useTranslations('listing');

  const [listing, setListing] = useState<Listing | null>(null);
  const [similar, setSimilar] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFav, toggle } = useFavorites();

  useEffect(() => {
    fetchListing(id)
      .then((data) => {
        setListing(data);
        return fetchListings({ category: data.category, limit: '4' });
      })
      .then((data) => setSimilar(data.listings.filter((l) => l.id !== id).slice(0, 3)))
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, border: '4px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!listing) return notFound();

  const title = getTitle(listing, locale);
  const description = getDesc(listing, locale);
  const PHONE = '+994505780509';
  const whatsappMsg = encodeURIComponent(`${t('whatsappIntro')}: ${title}`);

  return (
    <div style={{ background: 'var(--color-bg)', paddingBottom: '5rem' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
          <Link href={`/${locale}`} style={{ color: 'inherit', textDecoration: 'none' }}>{t('breadcrumbHome')}</Link>
          <ChevronRight size={14} />
          <Link href={`/${locale}/listings`} style={{ color: 'inherit', textDecoration: 'none' }}>{t('breadcrumbListings')}</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{title}</span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

          {/* Left column */}
          <div>
            <ImageGallery images={listing.images} title={title} />

            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', marginTop: '1.5rem', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
                <span className={`badge ${listing.category === 'SALE' ? 'badge-sale' : 'badge-rent'}`}>
                  {listing.category === 'SALE' ? t('sale') : t('rent')}
                </span>
                {listing.isNew && <span className="badge badge-new">{t('new')}</span>}
                {listing.isFeatured && <span className="badge badge-featured">{t('featured')}</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: '0.75rem' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>
                  {title}
                </h1>
                <button
                  onClick={() => toggle(id)}
                  title={isFav(id) ? 'Seçilmişlərdən çıxar' : 'Seçilmişlərə əlavə et'}
                  style={{
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    border: `2px solid ${isFav(id) ? '#ef4444' : 'var(--color-border)'}`,
                    background: isFav(id) ? 'rgba(239,68,68,0.08)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s ease',
                    boxShadow: isFav(id) ? '0 0 0 4px rgba(239,68,68,0.1)' : 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Heart
                    size={20}
                    fill={isFav(id) ? '#ef4444' : 'none'}
                    color={isFav(id) ? '#ef4444' : 'var(--color-text-muted)'}
                    style={{ transition: 'all 0.25s ease' }}
                  />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <MapPin size={15} />
                {listing.address || `${listing.district}, ${listing.city}`}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                {[
                  listing.rooms ? { icon: BedDouble, label: `${listing.rooms} ${t('rooms')}` } : null,
                  listing.bathrooms ? { icon: Bath, label: `${listing.bathrooms} ${t('bathroom')}` } : null,
                  { icon: Maximize2, label: `${listing.area} ${t('area')}` },
                  listing.floor && listing.totalFloors ? { icon: Layers, label: `${listing.floor}/${listing.totalFloors} ${t('floor')}` } : null,
                  listing.buildYear ? { icon: Calendar, label: `${listing.buildYear}` } : null,
                  { icon: Eye, label: `${listing.viewCount} ${t('viewCount')}` },
                ].filter(Boolean).map((spec, i) => {
                  const s = spec as { icon: React.ElementType; label: string };
                  const Icon = s.icon;
                  return (
                    <div key={i} style={{ background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-sm)', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' }}>
                      <Icon size={20} color="var(--color-primary)" />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', marginTop: '1.25rem', border: '1px solid var(--color-border)' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem' }}>
                {t('description')}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>{description}</p>
            </div>

            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', marginTop: '1.25rem', border: '1px solid var(--color-border)' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                {t('features')}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {[
                  { has: listing.hasParking, icon: Car, label: t('parking') },
                  { has: listing.hasBalcony, icon: Wind, label: t('balcony') },
                  { has: listing.hasElevator, icon: Layers, label: t('elevator') },
                  { has: listing.hasFurniture, icon: Sofa, label: t('furniture') },
                  { has: listing.hasAC, icon: Wind, label: t('ac') },
                  { has: listing.hasInternet, icon: Wifi, label: t('internet') },
                  { has: listing.hasSecurity, icon: Shield, label: t('security') },
                  { has: listing.hasPool, icon: Waves, label: t('pool') },
                  { has: listing.hasGym, icon: Dumbbell, label: t('gym') },
                ].map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: feat.has ? 'rgba(22,163,74,0.06)' : 'var(--color-surface-alt)', border: `1px solid ${feat.has ? 'rgba(22,163,74,0.2)' : 'var(--color-border)'}`, opacity: feat.has ? 1 : 0.5 }}>
                      <Icon size={16} color={feat.has ? '#16A34A' : 'var(--color-text-muted)'} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: feat.has ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>{feat.label}</span>
                      {feat.has && <Check size={14} color="#16A34A" style={{ marginLeft: 'auto' }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map */}
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', marginTop: '1.25rem', border: '1px solid var(--color-border)' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={20} /> {t('location')}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                📍 {listing.address || `${listing.district}, ${listing.city}`}
              </p>
              <ListingMap district={listing.district} city={listing.city} />
            </div>

            {similar.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '1.25rem' }}>
                  {t('similar')}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  {similar.map((l) => <ListingCard key={l.id} listing={l} />)}
                </div>
              </div>
            )}
          </div>

          {/* Right — contact box */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ background: 'var(--color-primary)', padding: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent-light)' }}>
                  {formatPrice(listing.price, listing.currency)}
                  {listing.category === 'RENT' && <span style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.6)', marginLeft: 6 }}>/ay</span>}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginTop: '4px' }}>
                  {listing.area} m² · {listing.district}, {listing.city}
                </div>
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href={`tel:${PHONE}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'var(--color-primary)', color: '#fff', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
                  <Phone size={18} /> {t('contactBox.call')}
                </a>
                <a href={`https://wa.me/${PHONE.replace('+', '')}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#25D366', color: '#fff', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 340px"] { grid-template-columns: 1fr !important; }
          div[style*="position: sticky"] { position: static !important; }
        }
      `}</style>
    </div>
  );
}

const PLACEHOLDER = 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=800';

function ImageGallery({ images, title }: { images: { url: string; alt?: string }[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const displayImages = images.length > 0 ? images : [{ url: PLACEHOLDER, alt: title }];

  return (
    <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative', background: '#000' }}>
      <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
        <img src={displayImages[current]?.url} alt={displayImages[current]?.alt || title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        {displayImages.length > 1 && (
          <>
            <button onClick={() => setCurrent((c) => (c - 1 + displayImages.length) % displayImages.length)} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setCurrent((c) => (c + 1) % displayImages.length)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={20} />
            </button>
            <div style={{ position: 'absolute', bottom: 12, right: 16, background: 'rgba(0,0,0,0.55)', color: '#fff', padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
              {current + 1}/{displayImages.length}
            </div>
          </>
        )}
      </div>
      {displayImages.length > 1 && (
        <div style={{ display: 'flex', gap: '6px', padding: '8px', background: 'var(--color-surface)', overflowX: 'auto' }}>
          {displayImages.map((img, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ flexShrink: 0, width: 80, height: 56, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: `2px solid ${i === current ? 'var(--color-accent)' : 'transparent'}`, cursor: 'pointer', padding: 0, background: 'none' }}>
              <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
