'use client'

import { ArrowUpDown, SlidersHorizontal } from 'lucide-react'
import type { SortKey } from '@/lib/search'
import { formatNumber } from '@/lib/format'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Best match' },
  { value: 'rating-desc', label: 'Top rated' },
  { value: 'reviews-desc', label: 'Most reviewed' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest arrivals' },
  { value: 'name-asc', label: 'Name: A to Z' },
]

type Props = {
  total: number
  loading: boolean
  sort: SortKey
  onSortChange: (sort: SortKey) => void
  onOpenFilters: () => void
  query: string
}

export function Toolbar({ total, loading, sort, onSortChange, onOpenFilters, query }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-[var(--shadow-sm)] transition-colors hover:bg-accent lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
        <p className="text-sm text-muted-foreground">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Searching…
            </span>
          ) : (
            <>
              <span className="font-bold text-foreground">{formatNumber(total)}</span>{' '}
              {total === 1 ? 'item' : 'items'}
              {query?.trim() ? (
                <>
                  {' '}for <span className="font-semibold text-foreground">“{query.trim()}”</span>
                </>
              ) : null}
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortKey)}>
          <SelectTrigger className="h-9 w-[190px] bg-card text-sm shadow-[var(--shadow-sm)]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
