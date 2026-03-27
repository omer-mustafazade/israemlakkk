'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Eye, Star, StarOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { Listing } from '@/types';

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE: { label: 'Aktiv', color: '#16a34a', bg: '#dcfce7' },
  SOLD: { label: 'Satılıb', color: '#2563eb', bg: '#dbeafe' },
  RENTED: { label: 'İcarə', color: '#9333ea', bg: '#f3e8ff' },
  ARCHIVED: { label: 'Arxiv', color: '#6b7280', bg: '#f3f4f6' },
};

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadListings = useCallback(async (p: number, s: string) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(p), limit: '15' });
      if (s) qs.set('search', s);
      const res = await fetch(`/api/admin/listings?${qs}`);
      const data = await res.json();
      setListings(data.listings ?? []);
      setTotal(data.pagination?.total ?? 0);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings(page, search);
  }, [page, search, loadListings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" elanını silmək istədiyinizdən əminsiniz?`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/listings/${id}`, { method: 'DELETE' });
      loadListings(page, search);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleFeatured = async (listing: Listing) => {
    await fetch(`/api/admin/listings/${listing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...listing,
        descAz: listing.descriptionAz,
        descTr: listing.descriptionTr,
        descEn: listing.descriptionEn,
        imagesJson: JSON.stringify(listing.images.map(img => ({ url: img.url, alt: img.alt, isPrimary: img.isPrimary }))),
        isFeatured: !listing.isFeatured,
      }),
    });
    loadListings(page, search);
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827' }}>Elanlar</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: 2 }}>
            {loading ? '...' : `${total} elan`}
          </p>
        </div>
        <Link
          href="/admin/listings/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#2563eb',
            color: '#fff',
            padding: '9px 16px',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            whiteSpace: 'nowrap',
          }}
        >
          <Plus size={16} />
          Yeni elan
        </Link>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}
      >
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Başlıq, şəhər axtar..."
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              padding: '9px 12px 9px 34px',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: 8,
            padding: '9px 14px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontWeight: 500,
            color: '#374151',
          }}
        >
          Axtar
        </button>
      </form>

      {/* Table */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Yüklənir...</div>
        ) : listings.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
            <Building2Placeholder />
            <p style={{ marginTop: 12, fontWeight: 500 }}>Elan tapılmadı</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={thStyle}>Elan</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Qiymət</th>
                  <th style={thStyle}>Şəhər</th>
                  <th style={thStyle}>Baxış</th>
                  <th style={thStyle}>Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing, i) => {
                  const statusInfo = STATUS_LABELS[listing.status] ?? STATUS_LABELS.ACTIVE;
                  const image = listing.images.find((img) => img.isPrimary) ?? listing.images[0];
                  return (
                    <tr
                      key={listing.id}
                      style={{
                        borderBottom: i < listings.length - 1 ? '1px solid #f3f4f6' : 'none',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#f9fafb')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                    >
                      <td style={{ ...tdStyle, maxWidth: 280 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {image ? (
                            <img
                              src={image.url}
                              alt={image.alt}
                              style={{ width: 44, height: 36, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 44,
                                height: 36,
                                background: '#e5e7eb',
                                borderRadius: 6,
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 600,
                                color: '#111827',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: 200,
                              }}
                            >
                              {listing.titleAz}
                            </div>
                            <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>
                              {listing.propertyType} · {listing.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            background: statusInfo.bg,
                            color: statusInfo.color,
                            padding: '3px 9px',
                            borderRadius: 99,
                            fontSize: '0.78rem',
                            fontWeight: 600,
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>
                        {listing.price.toLocaleString()} {listing.currency}
                      </td>
                      <td style={{ ...tdStyle, color: '#6b7280' }}>{listing.city}</td>
                      <td style={{ ...tdStyle, color: '#6b7280' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Eye size={13} />
                          {listing.viewCount}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <button
                            onClick={() => toggleFeatured(listing)}
                            title={listing.isFeatured ? 'Öne çıxarmadan çıxar' : 'Öne çıxar'}
                            style={{
                              ...iconBtnStyle,
                              color: listing.isFeatured ? '#f59e0b' : '#9ca3af',
                            }}
                          >
                            {listing.isFeatured ? <Star size={15} fill="#f59e0b" /> : <StarOff size={15} />}
                          </button>
                          <Link
                            href={`/admin/listings/${listing.id}/edit`}
                            style={{ ...iconBtnStyle, color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                            title="Düzəliş et"
                          >
                            <Edit size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(listing.id, listing.titleAz)}
                            disabled={deletingId === listing.id}
                            style={{ ...iconBtnStyle, color: '#ef4444' }}
                            title="Sil"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: '1.25rem' }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={pageBtnStyle(page === 1)}
          >
            <ChevronLeft size={15} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            if (p !== 1 && p !== totalPages && Math.abs(p - page) > 2) return null;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  minWidth: 34,
                  height: 34,
                  borderRadius: 6,
                  border: p === page ? 'none' : '1px solid #d1d5db',
                  background: p === page ? '#2563eb' : '#fff',
                  color: p === page ? '#fff' : '#374151',
                  fontWeight: p === page ? 700 : 400,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={pageBtnStyle(page === totalPages)}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function Building2Placeholder() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 14px',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 14px',
  verticalAlign: 'middle',
};

const iconBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '5px',
  borderRadius: 6,
  display: 'flex',
  alignItems: 'center',
  transition: 'background 0.15s',
};

const pageBtnStyle = (disabled: boolean): React.CSSProperties => ({
  padding: '7px 10px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  background: disabled ? '#f9fafb' : '#fff',
  cursor: disabled ? 'not-allowed' : 'pointer',
  color: disabled ? '#d1d5db' : '#374151',
  display: 'flex',
  alignItems: 'center',
});
