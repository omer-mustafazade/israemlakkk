'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/listings', label: 'Elanlar', icon: Building2, exact: false },
  { href: '/admin/messages', label: 'Mesajlar', icon: MessageSquare, exact: false },
];

function Sidebar({ collapsed, onClose }: { collapsed?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside
      style={{
        width: collapsed ? 0 : 240,
        minHeight: '100vh',
        background: '#1a3c5e',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.25s ease',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '1.5rem 1.25rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
            İSRA Emlak
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
            Admin Panel
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 4 }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <Icon size={18} />
              {item.label}
              {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            color: 'rgba(255,255,255,0.55)',
            fontSize: '0.9rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)';
            (e.currentTarget as HTMLElement).style.color = '#fca5a5';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
          }}
        >
          <LogOut size={18} />
          Çıxış
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Desktop sidebar */}
      <div className="admin-sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
          }}
        >
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div style={{ position: 'relative', zIndex: 51 }}>
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile topbar */}
        <div
          className="admin-topbar-mobile"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: '#1a3c5e',
            color: '#fff',
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
          >
            <Menu size={22} />
          </button>
          <span style={{ fontWeight: 700 }}>İSRA Emlak Admin</span>
        </div>

        <main style={{ flex: 1, padding: '1.5rem' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-topbar-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
