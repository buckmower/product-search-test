import rawItems from '@/data/items.json'

export type Product = {
  id: number
  title: string
  brand: string
  category: string
  tags: string[]
  price: number | null
  rating: number | null
  reviews: number
  inStock: boolean
  releasedAt: string | null
  image: string
  imageWidth: number
  imageHeight: number
  description: string
}

type RawItem = {
  id?: number
  title?: string
  brand?: string
  category?: string
  tags?: unknown
  price?: unknown
  rating?: unknown
  reviews?: unknown
  inStock?: unknown
  releasedAt?: unknown
  image?: string
  imageWidth?: unknown
  imageHeight?: unknown
  description?: string
}

function cleanTitle(raw?: string): string {
  const t = (raw ?? '').replace(/\s+/g, ' ').trim()
  if (!t) return 'Untitled Item'
  const letters = t.replace(/[^a-zA-Z]/g, '')
  if (letters.length > 0 && letters === letters.toUpperCase()) {
    return t.toLowerCase().replace(/\b([a-z])/g, (m) => m.toUpperCase())
  }
  return t
}

function parsePrice(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const n = parseFloat(raw.replace(/[^0-9.\-]/g, ''))
    return Number.isFinite(n) ? n : null
  }
  return null
}

function parseRating(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const n = parseFloat(raw)
    return Number.isFinite(n) ? n : null
  }
  return null
}

// Some records ship empty or non-resolvable image hosts (e.g. cdn.catalog.example).
// Map anything that isn't a known-good host to a deterministic, working image so
// every card renders and we avoid failed network requests in the console.
function sanitizeImage(raw: unknown, id: number, w: number, h: number): string {
  const url = typeof raw === 'string' ? raw.trim() : ''
  const okHosts = ['picsum.photos', 'cdn.abacus.ai', 'images.unsplash.com']
  let host = ''
  try {
    host = url ? new URL(url).hostname : ''
  } catch {
    host = ''
  }
  if (host && okHosts.includes(host)) return url
  const width = Number.isFinite(w) && w > 0 ? Math.round(w) : 600
  const height = Number.isFinite(h) && h > 0 ? Math.round(h) : 450
  return `https://blog.openreplay.com/images/top-5-image-placeholder-services/images/hero.png`
}

function normalize(item: RawItem, index: number): Product {
  const id = typeof item?.id === 'number' ? item.id : index + 1
  const tags = Array.isArray(item?.tags)
    ? (item.tags as unknown[])
        .map((t) => (typeof t === 'string' ? t.trim().toLowerCase() : ''))
        .filter((t): t is string => t.length > 0)
    : []
  const imageWidth = typeof item?.imageWidth === 'number' ? item.imageWidth : 600
  const imageHeight = typeof item?.imageHeight === 'number' ? item.imageHeight : 450
  return {
    id,
    title: cleanTitle(item?.title),
    brand: (item?.brand ?? 'Unknown').toString().trim() || 'Unknown',
    category: (item?.category ?? 'Uncategorized').toString().trim() || 'Uncategorized',
    tags,
    price: parsePrice(item?.price),
    rating: parseRating(item?.rating),
    reviews:
      typeof item?.reviews === 'number'
        ? item.reviews
        : parseInt(String(item?.reviews ?? 0), 10) || 0,
    inStock: Boolean(item?.inStock),
    releasedAt: typeof item?.releasedAt === 'string' ? item.releasedAt : null,
    image: sanitizeImage(item?.image, id, imageWidth, imageHeight),
    imageWidth,
    imageHeight,
    description: (item?.description ?? '').toString().trim(),
  }
}

// Build the normalized catalog once at module load (server-side singleton).
const PRODUCTS: Product[] = (Array.isArray(rawItems) ? (rawItems as RawItem[]) : []).map(normalize)

export function getAllProducts(): Product[] {
  return PRODUCTS
}

export type Facet = { value: string; count: number }

export function getStaticFacets() {
  const categories = new Map<string, number>()
  const tags = new Map<string, number>()
  const brands = new Map<string, number>()
  let minPrice = Infinity
  let maxPrice = -Infinity
  for (const p of PRODUCTS) {
    categories.set(p.category, (categories.get(p.category) ?? 0) + 1)
    brands.set(p.brand, (brands.get(p.brand) ?? 0) + 1)
    for (const t of p.tags) tags.set(t, (tags.get(t) ?? 0) + 1)
    if (p.price != null) {
      if (p.price < minPrice) minPrice = p.price
      if (p.price > maxPrice) maxPrice = p.price
    }
  }
  const toSorted = (m: Map<string, number>): Facet[] =>
    Array.from(m.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
  return {
    categories: toSorted(categories),
    tags: toSorted(tags),
    brands: toSorted(brands),
    priceRange: {
      min: Number.isFinite(minPrice) ? Math.floor(minPrice) : 0,
      max: Number.isFinite(maxPrice) ? Math.ceil(maxPrice) : 0,
    },
    total: PRODUCTS.length,
  }
}
