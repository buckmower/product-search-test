'use client'

import { X } from 'lucide-react'
import type { FiltersState } from './filter-sidebar'
import { formatPrice } from '@/lib/format'

type Props = {
  filters: FiltersState
  priceRange: { min: number; max: number }
  onRemove: (next: Partial<FiltersState>) => void
  onClearAll: () => void
}

type Chip = { key: string; label: string; clear: Partial<FiltersState> }

export function ActiveFilters({ filters, priceRange, onRemove, onClearAll }: Props) {
  const chips: Chip[] = []

  for (const c of filters?.categories ?? []) {
    chips.push({
      key: `cat-${c}`,
      label: c,
      clear: { categories: (filters?.categories ?? []).filter((v) => v !== c) },
    })
  }
  for (const b of filters?.brands ?? []) {
    chips.push({
      key: `brand-${b}`,
      label: b,
      clear: { brands: (filters?.brands ?? []).filter((v) => v !== b) },
    })
  }
  for (const t of filters?.tags ?? []) {
    chips.push({
      key: `tag-${t}`,
      label: `#${t}`,
      clear: { tags: (filters?.tags ?? []).filter((v) => v !== t) },
    })
  }
  if (filters?.inStockOnly) {
    chips.push({ key: 'stock', label: 'In stock', clear: { inStockOnly: false } })
  }
  if ((filters?.minRating ?? 0) > 0) {
    chips.push({
      key: 'rating',
      label: `${filters.minRating}+ stars`,
      clear: { minRating: 0 },
    })
  }
  const [pMin, pMax] = filters?.price ?? [priceRange?.min ?? 0, priceRange?.max ?? 0]
  const priceTouched = pMin > (priceRange?.min ?? 0) || pMax < (priceRange?.max ?? 0)
  if (priceTouched) {
    chips.push({
      key: 'price',
      label: `${formatPrice(pMin)} – ${formatPrice(pMax)}`,
      clear: { price: [priceRange?.min ?? 0, priceRange?.max ?? 0] },
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.clear)}
          className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-semibold capitalize text-foreground shadow-[var(--shadow-sm)] transition-colors hover:bg-destructive hover:text-destructive-foreground"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-semibold text-primary hover:underline"
      >
        Clear all
      </button>
    </div>
  )
}
