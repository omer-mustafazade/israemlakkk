'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons in Next.js
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

async function geocode(query: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'az,en' } },
    );
    const data = await res.json();
    if (!data[0]) return null;
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch {
    return null;
  }
}

interface Props {
  district: string;
  city: string;
  address?: string;
}

export default function ListingMap({ district, city, address }: Props) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const precise = address ? `${address}, ${district}, ${city}, Azerbaijan` : null;
    const fallback1 = `${district}, ${city}, Azerbaijan`;
    const fallback2 = `${city}, Azerbaijan`;

    (precise ? geocode(precise) : Promise.resolve(null))
      .then(c => c ?? geocode(fallback1))
      .then(c => c ?? geocode(fallback2))
      .then(c => setCoords(c))
      .finally(() => setLoading(false));
  }, [district, city, address]);

  if (loading) {
    return (
      <div style={{
        height: 280,
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e2eaf3 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        color: 'var(--color-text-muted)',
        fontSize: '0.9rem',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{
          width: 28,
          height: 28,
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        Xəritə yüklənir...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!coords) {
    return (
      <div style={{
        height: 120,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-surface-alt)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: 'var(--color-text-muted)',
        fontSize: '0.9rem',
        border: '1px solid var(--color-border)',
      }}>
        📍 {district}, {city}
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
      <MapContainer
        center={coords}
        zoom={15}
        style={{ height: 280, zIndex: 1 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={coords} icon={markerIcon}>
          <Popup>
            <strong>{district}</strong><br />{city}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
