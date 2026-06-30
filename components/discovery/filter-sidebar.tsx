'use client'

import { useMemo, useState } from 'react'
import { Search, Star, RotateCcw, Check, X } from 'lucide-react'
import type { Facet } from '@/lib/products'
import { PriceRangeSlider } from './price-range-slider'
import { Switch } from '@/components/ui/switch'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'

export type FiltersState = {
  categories: string[]
  tags: string[]
  brands: string[]
  inStockOnly: boolean
  price: [number, number]
  minRating: number
}

type DynamicFacets = {
  categories: Facet[]
  tags: Facet[]
  brands: Facet[]
}

type Props = {
  staticFacets: {
    categories: Facet[]
    tags: Facet[]
    brands: Facet[]
    priceRange: { min: number; max: number }
  }
  dynamicFacets: DynamicFacets
  filters: FiltersState
  onChange: (next: Partial<FiltersState>) => void
  onPriceCommit: (value: [number, number]) => void
  onReset: () => void
  activeCount: number
}

function countMap(facets: Facet[]): Record<string, number> {
  const m: Record<string, number> = {}
  for (const f of facets ?? []) m[f.value] = f.count
  return m
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-3 font-display text-sm font-semibold tracking-tight text-foreground">
      {children}
    </h4>
  )
}

export function FilterSidebar({
  staticFacets,
  dynamicFacets,
  filters,
  onChange,
  onPriceCommit,
  onReset,
  activeCount,
}: Props) {
  const [tagQuery, setTagQuery] = useState('')
  const [showAllBrands, setShowAllBrands] = useState(false)

  const catCounts = useMemo(() => countMap(dynamicFacets?.categories), [dynamicFacets])
  const tagCounts = useMemo(() => countMap(dynamicFacets?.tags), [dynamicFacets])
  const brandCounts = useMemo(() => countMap(dynamicFacets?.brands), [dynamicFacets])

  const toggle = (key: 'categories' | 'tags' | 'brands', value: string) => {
    const current = filters?.[key] ?? []
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ [key]: next } as Partial<FiltersState>)
  }

  const visibleTags = useMemo(() => {
    const q = tagQuery.trim().toLowerCase()
    const list = staticFacets?.tags ?? []
    const filtered = q ? list.filter((t) => t.value.includes(q)) : list
    return filtered.slice(0, q ? 40 : 28)
  }, [staticFacets, tagQuery])

  const brandList = staticFacets?.brands ?? []
  const visibleBrands = showAllBrands ? brandList : brandList.slice(0, 6)

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold tracking-tight text-foreground">
          Refine
        </h3>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-accent"
          >
            <RotateCcw className="h-3 w-3" /> Reset ({activeCount})
          </button>
        )}
      </div>

      {/* Availability */}
      <div className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2.5">
        <label htmlFor="in-stock" className="text-sm font-medium text-foreground">
          In stock only
        </label>
        <Switch
          id="in-stock"
          checked={filters?.inStockOnly ?? false}
          onCheckedChange={(v) => onChange({ inStockOnly: Boolean(v) })}
        />
      </div>

      {/* Categories */}
      <div>
        <SectionTitle>Category</SectionTitle>
        <div className="space-y-1">
          {(staticFacets?.categories ?? []).map((c) => {
            const checked = (filters?.categories ?? []).includes(c.value)
            const count = catCounts[c.value] ?? 0
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => toggle('categories', c.value)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors',
                  checked
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'text-foreground hover:bg-accent',
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                      checked
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card',
                    )}
                  >
                    {checked && <Check className="h-3 w-3" />}
                  </span>
                  {c.value}
                </span>
                <span className={cn('text-xs', checked ? 'text-primary' : 'text-muted-foreground')}>
                  {formatNumber(count)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Price */}
      <div>
        <SectionTitle>Price range</SectionTitle>
        <PriceRangeSlider
          min={staticFacets?.priceRange?.min ?? 0}
          max={staticFacets?.priceRange?.max ?? 0}
          value={filters?.price ?? [0, 0]}
          onChange={(v) => onChange({ price: v })}
          onCommit={onPriceCommit}
        />
      </div>

      {/* Rating */}
      <div>
        <SectionTitle>Minimum rating</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {[0, 3, 3.5, 4, 4.5].map((r) => {
            const active = (filters?.minRating ?? 0) === r
            return (
              <button
                key={r}
                type="button"
                onClick={() => onChange({ minRating: r })}
                className={cn(
                  'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent',
                )}
              >
                {r === 0 ? (
                  'Any'
                ) : (
                  <>
                    <Star className="h-3 w-3 fill-current" />
                    {r}+
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Brands */}
      <div>
        <SectionTitle>Brand</SectionTitle>
        <div className="space-y-1">
          {visibleBrands.map((b) => {
            const checked = (filters?.brands ?? []).includes(b.value)
            const count = brandCounts[b.value] ?? 0
            return (
              <button
                key={b.value}
                type="button"
                onClick={() => toggle('brands', b.value)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors',
                  checked
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'text-foreground hover:bg-accent',
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                      checked
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card',
                    )}
                  >
                    {checked && <Check className="h-3 w-3" />}
                  </span>
                  {b.value}
                </span>
                <span className={cn('text-xs', checked ? 'text-primary' : 'text-muted-foreground')}>
                  {formatNumber(count)}
                </span>
              </button>
            )
          })}
          {brandList.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAllBrands((s) => !s)}
              className="px-2.5 pt-1 text-xs font-semibold text-primary hover:underline"
            >
              {showAllBrands ? 'Show less' : `Show all ${brandList.length} brands`}
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <SectionTitle>Tags</SectionTitle>
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={tagQuery}
            onChange={(e) => setTagQuery(e.target.value)}
            placeholder="Filter tags…"
            className="w-full rounded-lg border border-input bg-card py-1.5 pl-8 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {visibleTags.map((t) => {
            const checked = (filters?.tags ?? []).includes(t.value)
            const count = tagCounts[t.value] ?? 0
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => toggle('tags', t.value)}
                className={cn(
                  'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-colors',
                  checked
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent',
                )}
              >
                {checked && <X className="h-3 w-3" />}
                {t.value}
                <span className={cn('text-[10px]', checked ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                  {count}
                </span>
              </button>
            )
          })}
          {visibleTags.length === 0 && (
            <p className="text-xs text-muted-foreground">No tags match “{tagQuery}”.</p>
          )}
        </div>
      </div>
    </div>
  )
}
