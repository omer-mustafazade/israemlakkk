/**
 * Central input validation utilities.
 * All user-facing API routes must sanitize inputs through these helpers.
 */

/** Trim and validate string length. Returns null if invalid. */
export function sanitizeStr(
  value: unknown,
  { min = 0, max }: { min?: number; max: number }
): string | null {
  if (typeof value !== 'string') return null;
  const s = value.trim();
  if (s.length < min || s.length > max) return null;
  return s;
}

/** Parse and validate an integer within bounds. Returns null if invalid. */
export function parsePositiveInt(
  value: unknown,
  { min = 1, max = 2_147_483_647 }: { min?: number; max?: number } = {}
): number | null {
  const n = typeof value === 'string' ? parseInt(value, 10) : Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

/** Parse and validate a finite float within bounds. Returns null if invalid. */
export function parsePositiveFloat(
  value: unknown,
  { min = 0, max = 1_000_000_000 }: { min?: number; max?: number } = {}
): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (!Number.isFinite(n) || n < min || n > max) return null;
  return n;
}

/** Assert value is one of the allowed enum strings. Returns null if not. */
export function assertEnum<T extends string>(
  value: unknown,
  allowed: readonly T[]
): T | null {
  if (typeof value !== 'string') return null;
  return (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

/** Validate a route ID (cuid / alphanumeric, 1-50 chars). */
export function sanitizeId(id: unknown): string | null {
  if (typeof id !== 'string') return null;
  if (id.length < 1 || id.length > 50) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return null;
  return id;
}

/** Validate and parse imagesJson field (JSON array, max 100 KB). */
export function parseImagesJson(value: unknown): string | null {
  if (typeof value !== 'string') return '[]';
  if (value.length > 100_000) return null; // 100 KB cap
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return null;
    for (const item of parsed) {
      if (typeof item !== 'object' || item === null) return null;
      if (typeof item.url !== 'string' || item.url.length > 2048) return null;
    }
    return value;
  } catch {
    return null;
  }
}

/** Allowed enum values shared across listing routes. */
export const CATEGORY = ['SALE', 'RENT'] as const;
export const PROPERTY_TYPE = ['APARTMENT', 'HOUSE', 'VILLA', 'OFFICE', 'LAND', 'COMMERCIAL'] as const;
export const STATUS = ['ACTIVE', 'SOLD', 'RENTED', 'INACTIVE'] as const;
export const CURRENCY = ['AZN', 'USD', 'EUR'] as const;
export const SORT_FIELDS = ['price', 'area', 'createdAt', 'viewCount'] as const;
export const SORT_ORDERS = ['asc', 'desc'] as const;
export const FEATURE_KEYS = ['parking', 'balcony', 'elevator', 'furniture', 'pool', 'security', 'ac', 'internet', 'gym'] as const;
