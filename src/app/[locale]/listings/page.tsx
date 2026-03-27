'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { LayoutGrid, List, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Listing } from '@/types';
import { fetchListings } from '@/lib/api';
import ListingCard from '@/components/listings/ListingCard';
import FilterPanel from '@/components/listings/FilterPanel';

const DEFAULT_FILTERS = {
  category: '',
  type: '',
  city: '',
  priceMin: '',
  priceMax: '',
  areaMin: '',
  areaMax: '',
  rooms: '',
  features: [] as string[],
};

function sortToApiParams(sort: string): { sortBy: string; sortOrder: string } {
  switch (sort) {
    case 'newest': return { sortBy: 'createdAt', sortOrder: 'desc' };
    case 'oldest': return { sortBy: 'createdAt', sortOrder: 'asc' };
    case 'price_asc': return { sortBy: 'price', sortOrder: 'asc' };
    case 'price_desc': return { sortBy: 'price', sortOrder: 'desc' };
    case 'most_viewed': return { sortBy: 'viewCount', sortOrder: 'desc' };
    default: return { sortBy: 'createdAt', sortOrder: 'desc' };
  }
}

export default function ListingsPage() {
  const t = useTranslations('filter');
  const tl = useTranslations('listing');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const LIMIT = 12;

  // Read URL params on mount
  useEffect(() => {
    const cat = searchParams.get('category') ?? '';
    const type = searchParams.get('type') ?? '';
    const city = searchParams.get('city') ?? '';
    const sortParam = searchParams.get('sort') ?? 'newest';
    const pageParam = parseInt(searchParams.get('page') ?? '1');
    setFilters((f) => ({ ...f, category: cat, type, city }));
    setSort(sortParam);
    setPage(pageParam);
  }, []);

  const loadListings = useCallback(async (currentFilters: typeof filters, currentSort: string, currentPage: number) => {
    setLoading(true);
    try {
      const { sortBy, sortOrder } = sortToApiParams(currentSort);
      const params: Record<string, string> = {
        sortBy, sortOrder,
        page: String(currentPage),
        limit: String(LIMIT),
      };
      if (currentFilters.category) params.category = currentFilters.category;
      if (currentFilters.type) params.propertyType = currentFilters.type;
      if (currentFilters.city) params.city = currentFilters.city;
      if (currentFilters.priceMin) params.minPrice = currentFilters.priceMin;
      if (currentFilters.priceMax) params.maxPrice = currentFilters.priceMax;
      if (currentFilters.areaMin) params.minArea = currentFilters.areaMin;
      if (currentFilters.areaMax) params.maxArea = currentFilters.areaMax;
      if (currentFilters.rooms) {
        if (currentFilters.rooms === '5+') params.minRooms = '5';
        else params.rooms = currentFilters.rooms;
      }
      if (currentFilters.features.length > 0) params.features = currentFilters.features.join(',');

      const data = await fetchListings(params);
      setListings(data.listings);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync to URL and fetch when filters/sort/page change
  useEffect(() => {
    const qs = new URLSearchParams();
    if (filters.category) qs.set('category', filters.category);
    if (filters.type) qs.set('type', filters.type);
    if (filters.city) qs.set('city', filters.city);
    if (sort !== 'newest') qs.set('sort', sort);
    if (page > 1) qs.set('page', String(page));
    const qsStr = qs.toString();
    router.replace(`${pathname}${qsStr ? `?${qsStr}` : ''}`, { scroll: false });
    loadListings(filters, sort, page);
  }, [filters, sort, page, pathname, router, loadListings]);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '80vh', padding: '2rem 0 5rem' }}>
      <div className="container">
        {/* Page header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 700,
              color: 'var(--color-primary)',
            }}
          >
            {tNav('listings')}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            {loading ? '...' : tl('resultsFound', { count: total })}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start' }}>
          {/* Filter sidebar — desktop */}
          <div style={{ width: 280, flexShrink: 0 }} className="filter-sidebar">
            <FilterPanel
              filters={filters}
              onChange={handleFiltersChange}
              onReset={() => { setFilters(DEFAULT_FILTERS); setPage(1); }}
            />
          </div>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
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
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="mobile-filter-btn"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 16px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                <SlidersHorizontal size={16} /> {t('title')}
              </button>

              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-primary)',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                <option value="newest">{t('newest')}</option>
                <option value="oldest">{t('oldest')}</option>
                <option value="price_asc">{t('priceAsc')}</option>
                <option value="price_desc">{t('priceDesc')}</option>
                <option value="most_viewed">{t('mostViewed')}</option>
              </select>

              <div style={{ display: 'flex', gap: '4px', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-sm)', padding: '3px' }}>
                {(['grid', 'list'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      background: view === v ? '#fff' : 'transparent',
                      color: view === v ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      boxShadow: view === v ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {v === 'grid' ? <LayoutGrid size={16} /> : <List size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {mobileFilterOpen && (
              <div style={{ marginBottom: '1.5rem' }} className="mobile-filter-panel">
                <FilterPanel
                  filters={filters}
                  onChange={handleFiltersChange}
                  onReset={() => { setFilters(DEFAULT_FILTERS); setPage(1); }}
                />
              </div>
            )}

            {/* Results */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ height: 380, borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-alt)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{tl('noResults')}</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{tl('tryReset')}</p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(260px, 1fr))' : '1fr',
                  gap: '1.25rem',
                }}
              >
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '2.5rem' }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)',
                    background: page === 1 ? 'var(--color-surface-alt)' : '#fff',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    color: page === 1 ? 'var(--color-text-muted)' : 'var(--color-primary)',
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  if (p !== 1 && p !== totalPages && Math.abs(p - page) > 2) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        minWidth: 36, height: 36, borderRadius: 'var(--radius-sm)',
                        border: p === page ? 'none' : '1px solid var(--color-border)',
                        background: p === page ? 'var(--color-primary)' : '#fff',
                        color: p === page ? '#fff' : 'var(--color-text-primary)',
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
                  style={{
                    padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)',
                    background: page === totalPages ? 'var(--color-surface-alt)' : '#fff',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    color: page === totalPages ? 'var(--color-text-muted)' : 'var(--color-primary)',
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .filter-sidebar { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
