'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { SearchX } from 'lucide-react'
import type { Product } from '@/lib/products'
import { ProductCard } from './product-card'

type Props = {
  items: Product[]
  loading: boolean
  initialLoad: boolean
  onOpen: (product: Product) => void
  onTagClick: (tag: string) => void
  onClearAll: () => void
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-sm)]">
      <div className="aspect-[4/3] w-full animate-pulse bg-muted" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

export function ResultsGrid({
  items,
  loading,
  initialLoad,
  onOpen,
  onTagClick,
  onClearAll,
}: Props) {
  if (initialLoad) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!loading && (items?.length ?? 0) === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-card px-6 py-20 text-center shadow-[var(--shadow-sm)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
          <SearchX className="h-8 w-8" />
        </div>
        <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-foreground">
          Nothing matches just yet
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Try a different search term or loosen your filters to discover more cozy finds.
        </p>
        <button
          type="button"
          onClick={onClearAll}
          className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Clear all filters
        </button>
      </div>
    )
  }

  return (
    <div
      className={`grid grid-cols-1 gap-5 transition-opacity duration-200 sm:grid-cols-2 xl:grid-cols-3 ${
        loading ? 'opacity-60' : 'opacity-100'
      }`}
    >
      <AnimatePresence mode="popLayout">
        {(items ?? []).map((p) => (
          <ProductCard key={p?.id} product={p} onOpen={onOpen} onTagClick={onTagClick} />
        ))}
      </AnimatePresence>
    </div>
  )
}
