import { getAllProducts, type Product, type Facet } from './products'

export type SortKey =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'reviews-desc'
  | 'newest'
  | 'name-asc'

export type QueryParams = {
  q: string
  categories: string[]
  tags: string[]
  brands: string[]
  inStockOnly: boolean
  minPrice: number | null
  maxPrice: number | null
  minRating: number
  sort: SortKey
  page: number
  pageSize: number
}

export type SearchResponse = {
  items: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  facets: {
    categories: Facet[]
    tags: Facet[]
    brands: Facet[]
  }
}

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
}

// Relevance score for a product against query tokens. Higher = better.
function scoreProduct(p: Product, tokens: string[]): number {
  if (tokens.length === 0) return 0
  const title = p.title.toLowerCase()
  const desc = p.description.toLowerCase()
  const tagStr = p.tags.join(' ')
  const brand = p.brand.toLowerCase()
  let score = 0
  for (const tok of tokens) {
    let matched = false
    if (title.includes(tok)) {
      score += title.startsWith(tok) ? 12 : 8
      matched = true
    }
    if (p.tags.some((t) => t === tok)) {
      score += 6
      matched = true
    } else if (tagStr.includes(tok)) {
      score += 3
      matched = true
    }
    if (brand.includes(tok)) {
      score += 4
      matched = true
    }
    if (desc.includes(tok)) {
      score += 2
      matched = true
    }
    if (!matched) return -1 // every token must match somewhere (AND semantics)
  }
  // small boosts for quality signals
  score += (p.rating ?? 0) * 0.4
  return score
}

function matchesQuery(p: Product, tokens: string[]): boolean {
  if (tokens.length === 0) return true
  return scoreProduct(p, tokens) >= 0
}

function buildFacets(products: Product[]): Facet[] {
  const m = new Map<string, number>()
  for (const p of products) m.set(p.category, (m.get(p.category) ?? 0) + 1)
  return Array.from(m.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
}

function facetCounts(products: Product[], key: 'category' | 'brand'): Facet[] {
  const m = new Map<string, number>()
  for (const p of products) {
    const v = p[key]
    m.set(v, (m.get(v) ?? 0) + 1)
  }
  return Array.from(m.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
}

function tagFacetCounts(products: Product[]): Facet[] {
  const m = new Map<string, number>()
  for (const p of products) for (const t of p.tags) m.set(t, (m.get(t) ?? 0) + 1)
  return Array.from(m.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
}

export function runSearch(params: QueryParams): SearchResponse {
  const all = getAllProducts()
  const tokens = tokenize(params.q)

  // Predicate helpers (excluding self-facet for faceted counts).
  const passText = (p: Product) => matchesQuery(p, tokens)
  const passPrice = (p: Product) => {
    if (params.minPrice != null && (p.price == null || p.price < params.minPrice)) return false
    if (params.maxPrice != null && (p.price == null || p.price > params.maxPrice)) return false
    return true
  }
  const passRating = (p: Product) =>
    params.minRating <= 0 ? true : (p.rating ?? 0) >= params.minRating
  const passStock = (p: Product) => (params.inStockOnly ? p.inStock : true)
  const passCategory = (p: Product) =>
    params.categories.length === 0 ? true : params.categories.includes(p.category)
  const passBrand = (p: Product) =>
    params.brands.length === 0 ? true : params.brands.includes(p.brand)
  const passTags = (p: Product) =>
    params.tags.length === 0 ? true : params.tags.every((t) => p.tags.includes(t))

  // Base set: everything passing the non-facet filters (text/price/rating/stock).
  const base = all.filter((p) => passText(p) && passPrice(p) && passRating(p) && passStock(p))

  // Faceted counts: each facet reflects the other active facet selections.
  const forCategoryFacet = base.filter((p) => passBrand(p) && passTags(p))
  const forBrandFacet = base.filter((p) => passCategory(p) && passTags(p))
  const forTagFacet = base.filter((p) => passCategory(p) && passBrand(p))

  const facets = {
    categories: facetCounts(forCategoryFacet, 'category'),
    brands: facetCounts(forBrandFacet, 'brand'),
    tags: tagFacetCounts(forTagFacet),
  }

  // Final filtered set (all filters applied).
  let results = base.filter((p) => passCategory(p) && passBrand(p) && passTags(p))

  // Sorting
  const sort = params.sort
  if (sort === 'relevance' && tokens.length > 0) {
    results = results
      .map((p) => ({ p, s: scoreProduct(p, tokens) }))
      .sort((a, b) => b.s - a.s || (b.p.rating ?? 0) - (a.p.rating ?? 0))
      .map((x) => x.p)
  } else if (sort === 'price-asc') {
    results = [...results].sort(
      (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
    )
  } else if (sort === 'price-desc') {
    results = [...results].sort(
      (a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity),
    )
  } else if (sort === 'rating-desc') {
    results = [...results].sort(
      (a, b) => (b.rating ?? -1) - (a.rating ?? -1) || b.reviews - a.reviews,
    )
  } else if (sort === 'reviews-desc') {
    results = [...results].sort((a, b) => b.reviews - a.reviews)
  } else if (sort === 'newest') {
    results = [...results].sort((a, b) =>
      (b.releasedAt ?? '').localeCompare(a.releasedAt ?? ''),
    )
  } else if (sort === 'name-asc') {
    results = [...results].sort((a, b) => a.title.localeCompare(b.title))
  } else {
    // relevance with no query -> popularity (reviews * rating)
    results = [...results].sort(
      (a, b) => (b.reviews * (b.rating ?? 0)) - (a.reviews * (a.rating ?? 0)),
    )
  }

  const total = results.length
  const pageSize = Math.max(1, params.pageSize)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(Math.max(1, params.page), totalPages)
  const start = (page - 1) * pageSize
  const items = results.slice(start, start + pageSize)

  return { items, total, page, pageSize, totalPages, facets }
}

export { buildFacets }
