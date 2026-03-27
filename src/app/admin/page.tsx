'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, Eye, MessageSquare, TrendingUp, CheckCircle, Clock, Plus } from 'lucide-react';

interface Stats {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  rentedListings: number;
  totalMessages: number;
  unreadMessages: number;
  totalViews: number;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: '1.5rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `${color}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>{value}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: 2 }}>
            İSRA Emlak idarəetmə paneli
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
          }}
        >
          <Plus size={16} />
          Yeni elan
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 100,
                borderRadius: 12,
                background: '#e5e7eb',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      ) : stats ? (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <StatCard
              label="Ümumi elanlar"
              value={stats.totalListings}
              icon={Building2}
              color="#2563eb"
              sub={`${stats.activeListings} aktiv`}
            />
            <StatCard
              label="Aktiv elanlar"
              value={stats.activeListings}
              icon={CheckCircle}
              color="#16a34a"
            />
            <StatCard
              label="Ümumi baxış"
              value={stats.totalViews.toLocaleString()}
              icon={Eye}
              color="#9333ea"
            />
            <StatCard
              label="Mesajlar"
              value={stats.totalMessages}
              icon={MessageSquare}
              color="#ea580c"
              sub={stats.unreadMessages > 0 ? `${stats.unreadMessages} oxunmamış` : undefined}
            />
          </div>

          {/* Status breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: '1.25rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Satılıb
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginTop: 4 }}>
                {stats.soldListings}
              </div>
              <div
                style={{
                  width: '100%',
                  height: 4,
                  background: '#f3f4f6',
                  borderRadius: 2,
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    width: stats.totalListings ? `${(stats.soldListings / stats.totalListings) * 100}%` : '0%',
                    height: '100%',
                    background: '#2563eb',
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
            <div
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: '1.25rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                İcarəyə verilib
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginTop: 4 }}>
                {stats.rentedListings}
              </div>
              <div
                style={{
                  width: '100%',
                  height: 4,
                  background: '#f3f4f6',
                  borderRadius: 2,
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    width: stats.totalListings ? `${(stats.rentedListings / stats.totalListings) * 100}%` : '0%',
                    height: '100%',
                    background: '#16a34a',
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/admin/listings"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: '12px 16px',
                textDecoration: 'none',
                color: '#374151',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              <Building2 size={16} color="#2563eb" />
              Bütün elanlar
            </Link>
            <Link
              href="/admin/messages"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: stats.unreadMessages > 0 ? '#fef3c7' : '#fff',
                border: `1px solid ${stats.unreadMessages > 0 ? '#fcd34d' : '#e5e7eb'}`,
                borderRadius: 8,
                padding: '12px 16px',
                textDecoration: 'none',
                color: '#374151',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              <MessageSquare size={16} color="#ea580c" />
              Mesajlar
              {stats.unreadMessages > 0 && (
                <span
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: 99,
                    fontSize: '0.7rem',
                    padding: '2px 6px',
                    fontWeight: 700,
                  }}
                >
                  {stats.unreadMessages}
                </span>
              )}
            </Link>
            <Link
              href="/az"
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: '12px 16px',
                textDecoration: 'none',
                color: '#374151',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              <TrendingUp size={16} color="#16a34a" />
              Saytı aç
            </Link>
          </div>
        </>
      ) : (
        <div style={{ color: '#ef4444' }}>Statistikalar yüklənmədi</div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
