export type Locale = 'az' | 'tr' | 'en';

export type Category = 'SALE' | 'RENT';

export type PropertyType =
  | 'APARTMENT'
  | 'HOUSE'
  | 'VILLA'
  | 'LAND'
  | 'COMMERCIAL'
  | 'OFFICE';

export type ListingStatus = 'ACTIVE' | 'SOLD' | 'RENTED' | 'ARCHIVED';

export interface ListingImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

export interface Listing {
  id: string;

  titleAz: string;
  titleTr: string;
  titleEn: string;
  descriptionAz: string;
  descriptionTr: string;
  descriptionEn: string;

  price: number;
  currency: string;
  category: Category;
  propertyType: PropertyType;
  status: ListingStatus;
  isFeatured: boolean;
  isNew: boolean;

  city: string;
  district: string;
  address?: string;
  latitude?: number;
  longitude?: number;

  area: number;
  rooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  buildYear?: number;

  hasParking: boolean;
  hasGarage: boolean;
  hasBalcony: boolean;
  hasElevator: boolean;
  hasFurniture: boolean;
  hasAC: boolean;
  hasHeating: boolean;
  hasInternet: boolean;
  hasSecurity: boolean;
  hasPool: boolean;
  hasGym: boolean;

  images: ListingImage[];
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

export interface FilterParams {
  category?: Category;
  type?: PropertyType;
  city?: string;
  district?: string;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  rooms?: number;
  features?: string[];
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'most_viewed';
  page?: number;
  perPage?: number;
}
