'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Facet, Product } from '@/lib/products'
import type { SortKey } from '@/lib/search'
import { runSearch } from '@/lib/search'
import { useDebounce } from '@/hooks/use-debounce'
import { SiteHeader } from './site-header'
import { Hero } from './hero'
import { Toolbar } from './toolbar'
import { ActiveFilters } from './active-filters'
import { ResultsGrid } from './results-grid'
import { PaginationBar } from './pagination-bar'
import { ProductQuickView } from './product-quick-view'
import { FilterSidebar, type FiltersState } from './filter-sidebar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Home } from 'lucide-react'

export type StaticFacets = {
  categories: Facet[]
  tags: Facet[]
  brands: Facet[]
  priceRange: { min: number; max: number }
  total: number
}

type Props = {
  staticFacets: StaticFacets
  heroImage: string
}

const PAGE_SIZE = 24

export function DiscoveryApp({ staticFacets, heroImage }: Props) {
  const priceRange = staticFacets?.priceRange ?? { min: 0, max: 0 }

  const [searchInput, setSearchInput] = useState('')
  const debouncedQuery = useDebounce(searchInput, 250)

  const [filters, setFilters] = useState<FiltersState>({
    categories: [],
    tags: [],
    brands: [],
    inStockOnly: false,
    price: [priceRange.min, priceRange.max],
    minRating: 0,
  })
  const [sort, setSort] = useState<SortKey>('relevance')
  const [page, setPage] = useState(1)

  const [items, setItems] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [dynamicFacets, setDynamicFacets] = useState({
    categories: staticFacets?.categories ?? [],
    tags: staticFacets?.tags ?? [],
    brands: staticFacets?.brands ?? [],
  })
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    window.setTimeout(() => {
      if (cancelled) return
      try {
        const data = runSearch({
          q: debouncedQuery.trim(),
          categories: filters.categories,
          tags: filters.tags,
          brands: filters.brands,
          inStockOnly: filters.inStockOnly,
          minPrice: filters.price[0] > priceRange.min ? filters.price[0] : null,
          maxPrice: filters.price[1] < priceRange.max ? filters.price[1] : null,
          minRating: filters.minRating,
          sort,
          page,
          pageSize: PAGE_SIZE,
        })
        if (cancelled) return
        setItems(data.items)
        setTotal(data.total)
        setTotalPages(data.totalPages)
        setDynamicFacets({
          categories: data.facets.categories,
          tags: data.facets.tags,
          brands: data.facets.brands,
        })
      } catch {
        setItems([])
        setTotal(0)
        setTotalPages(1)
      } finally {
        if (!cancelled) {
          setLoading(false)
          setInitialLoad(false)
        }
      }
    }, 0)
    return () => {
      cancelled = true
    }
  }, [debouncedQuery, filters, page, priceRange.max, priceRange.min, sort])

  const updateFilters = useCallback((partial: Partial<FiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }))
    setPage(1)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value)
    setPage(1)
  }, [])

  const handleSortChange = useCallback((next: SortKey) => {
    setSort(next)
    setPage(1)
  }, [])

  const handleReset = useCallback(() => {
    setFilters({
      categories: [],
      tags: [],
      brands: [],
      inStockOnly: false,
      price: [priceRange.min, priceRange.max],
      minRating: 0,
    })
    setPage(1)
  }, [priceRange.min, priceRange.max])

  const handleCategoryClick = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories
        : [...prev.categories, category],
    }))
    setPage(1)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleTagClick = useCallback((tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags : [...prev.tags, tag],
    }))
    setPage(1)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleSuggestion = useCallback((term: string) => {
    setSearchInput(term)
    setPage(1)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handlePageChange = useCallback((next: number) => {
    setPage(next)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const openQuickView = useCallback((product: Product) => {
    setQuickView(product)
    setQuickViewOpen(true)
  }, [])

  const activeCount = useMemo(() => {
    let n = 0
    n += filters.categories.length
    n += filters.tags.length
    n += filters.brands.length
    if (filters.inStockOnly) n += 1
    if (filters.minRating > 0) n += 1
    if (filters.price[0] > priceRange.min || filters.price[1] < priceRange.max) n += 1
    return n
  }, [filters, priceRange.min, priceRange.max])

  const sidebar = (
    <FilterSidebar
      staticFacets={staticFacets}
      dynamicFacets={dynamicFacets}
      filters={filters}
      onChange={updateFilters}
      onPriceCommit={(v) => updateFilters({ price: v })}
      onReset={handleReset}
      activeCount={activeCount}
    />
  )

  return (
    <div className="min-h-screen warm-grain">
      <SiteHeader value={searchInput} onChange={handleSearchChange} />

      <Hero
        heroImage={heroImage}
        totalProducts={staticFacets?.total ?? 0}
        categories={(staticFacets?.categories ?? []).map((c) => c.value)}
        onCategoryClick={handleCategoryClick}
        onSuggestionClick={handleSuggestion}
      />

      <div ref={topRef} className="scroll-mt-20" />

      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl bg-card p-5 shadow-[var(--shadow-sm)] scrollbar-none">
              {sidebar}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="space-y-4">
              <Toolbar
                total={total}
                loading={loading}
                sort={sort}
                onSortChange={handleSortChange}
                onOpenFilters={() => setMobileFiltersOpen(true)}
                query={debouncedQuery}
              />
              <ActiveFilters
                filters={filters}
                priceRange={priceRange}
                onRemove={updateFilters}
                onClearAll={handleReset}
              />
            </div>

            <div className="mt-6">
              <ResultsGrid
                items={items}
                loading={loading}
                initialLoad={initialLoad}
                onOpen={openQuickView}
                onTagClick={handleTagClick}
                onClearAll={handleReset}
              />
            </div>

            <div className="mt-10">
              <PaginationBar
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/70 bg-card/50">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-2 px-4 py-8 text-center sm:px-6">
          <span className="flex items-center gap-2 font-display font-bold tracking-tight text-foreground">
            <Home className="h-4 w-4 text-primary" /> Hearth & Home
          </span>
          <p className="text-xs text-muted-foreground">
            A cozy catalog of {new Intl.NumberFormat('en-US').format(staticFacets?.total ?? 0)}{' '}
            home goods, made for discovery.
          </p>
        </div>
      </footer>

      {/* Mobile filters sheet */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
          <div className="mt-6">{sidebar}</div>
        </SheetContent>
      </Sheet>

      <ProductQuickView
        product={quickView}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        onTagClick={handleTagClick}
      />
    </div>
  )
}
