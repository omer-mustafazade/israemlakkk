import { config } from 'dotenv';
config();
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws;

const listings = [
  {
    titleAz: '3 otaqlı mənzil — Nəsimi rayonu, Nizami küçəsi',
    titleTr: '3 odalı daire — Nesimi ilçesi, Nizami Caddesi',
    titleEn: '3-room apartment — Nasimi district, Nizami Street',
    descAz: 'Nizami küçəsinin mərkəzində yerləşən, tam təmirli, mebelli 3 otaqlı mənzil. Binada lift, mühafizə və otopark mövcuddur. Metro stansiyasına piyada məsafədə.',
    descTr: 'Nizami Caddesi\'nin merkezinde yer alan, tam tadilatlı, mobilyalı 3 odalı daire. Binada asansör, güvenlik ve otopark mevcuttur. Metro istasyonuna yürüme mesafesinde.',
    descEn: 'Fully renovated 3-room apartment in the heart of Nizami Street. Building has elevator, security and parking. Walking distance to metro station.',
    category: 'SALE',
    propertyType: 'APARTMENT',
    price: 185000,
    currency: 'USD',
    area: 95,
    city: 'Bakı',
    district: 'Nəsimi',
    address: 'Nizami küçəsi 45, mənzil 12',
    rooms: 3,
    bathrooms: 1,
    floor: 7,
    totalFloors: 16,
    buildYear: 2018,
    hasParking: true,
    hasBalcony: true,
    hasElevator: true,
    hasFurniture: true,
    hasAC: true,
    hasInternet: true,
    hasSecurity: true,
    hasPool: false,
    hasGym: false,
    isFeatured: true,
    isNew: false,
    viewCount: 342,
    imagesJson: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', alt: 'Salon', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', alt: 'Yataq otağı' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', alt: 'Mətbəx' },
    ]),
  },
  {
    titleAz: 'Lüks villa — Badamdar qəsəbəsi',
    titleTr: 'Lüks villa — Badamdar köyü',
    titleEn: 'Luxury villa — Badamdar settlement',
    descAz: 'Badamdar qəsəbəsinin sakit küçəsində yerləşən 4 otaqlı lüks villa. Geniş həyət, hovuz, fitnes zalı və 2 qarajlı. Bakı şəhərinə gözəl mənzərə.',
    descTr: 'Badamdar köyünün sakin sokağında yer alan 4 odalı lüks villa. Geniş bahçe, yüzme havuzu, spor salonu ve 2 garaj. Bakü şehrine muhteşem manzara.',
    descEn: 'Luxurious 4-room villa on a quiet street in Badamdar. Spacious yard, swimming pool, gym and 2-car garage. Stunning views of Baku city.',
    category: 'SALE',
    propertyType: 'VILLA',
    price: 750000,
    currency: 'USD',
    area: 320,
    city: 'Bakı',
    district: 'Badamdar',
    address: 'Badamdar qəsəbəsi, Nar küçəsi 8',
    rooms: 4,
    bathrooms: 3,
    floor: null,
    totalFloors: 2,
    buildYear: 2021,
    hasParking: true,
    hasBalcony: true,
    hasElevator: false,
    hasFurniture: true,
    hasAC: true,
    hasInternet: true,
    hasSecurity: true,
    hasPool: true,
    hasGym: true,
    isFeatured: true,
    isNew: false,
    viewCount: 521,
    imagesJson: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', alt: 'Villa', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', alt: 'Hovuz' },
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', alt: 'Həyət' },
    ]),
  },
  {
    titleAz: '2 otaqlı mənzil icarəyə — Səbail rayonu',
    titleTr: '2 odalı daire kiralık — Sabail ilçesi',
    titleEn: '2-room apartment for rent — Sabail district',
    descAz: 'Dəniz görünüşlü, 2 otaqlı tam mebelli mənzil. İcarə qiyməti kommunal xərclər daxildir.',
    descTr: 'Deniz manzaralı, 2 odalı tam mobilyalı daire. Kira fiyatı faturalar dahildir.',
    descEn: 'Sea-view 2-room fully furnished apartment. Rent price includes utilities.',
    category: 'RENT',
    propertyType: 'APARTMENT',
    price: 1200,
    currency: 'AZN',
    area: 68,
    city: 'Bakı',
    district: 'Səbail',
    address: 'İstiqlaliyyət küçəsi 23',
    rooms: 2,
    bathrooms: 1,
    floor: 5,
    totalFloors: 9,
    buildYear: 2015,
    hasParking: false,
    hasBalcony: true,
    hasElevator: true,
    hasFurniture: true,
    hasAC: true,
    hasInternet: true,
    hasSecurity: false,
    hasPool: false,
    hasGym: false,
    isFeatured: true,
    isNew: true,
    viewCount: 198,
    imagesJson: JSON.stringify([
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', alt: 'Salon', isPrimary: true },
    ]),
  },
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter } as never);

  console.log('Seeding database...');
  await prisma.listing.deleteMany();
  await prisma.contactMessage.deleteMany();

  for (const listing of listings) {
    await prisma.listing.create({ data: listing });
  }

  console.log(`Created ${listings.length} listings.`);
  await prisma.$disconnect();
  await pool.end();
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
