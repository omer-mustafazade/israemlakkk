import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ListingForm from '../_form/ListingForm';

export default function NewListingPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
        <Link
          href="/admin/listings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          <ChevronLeft size={16} />
          Geri
        </Link>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827' }}>Yeni elan</h1>
      </div>
      <ListingForm />
    </div>
  );
}
