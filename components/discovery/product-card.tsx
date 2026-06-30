'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { PackageCheck, PackageX, ImageOff, MessageSquareText } from 'lucide-react'
import type { Product } from '@/lib/products'
import { StarRating } from './star-rating'
import { formatPrice, formatCount } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Props = {
  product: Product
  onOpen: (product: Product) => void
  onTagClick?: (tag: string) => void
}

export function ProductCard({ product, onOpen, onTagClick }: Props) {
  const [imgError, setImgError] = useState(false)
  const p = product

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
    >
      <button
        type="button"
        onClick={() => onOpen?.(p)}
        className="relative block w-full overflow-hidden text-left"
        aria-label={`View details for ${p?.title}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {p?.image && !imgError ? (
            <Image
              src={p.image}
              alt={p?.title ?? 'Home goods product'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <ImageOff className="h-8 w-8" />
            </div>
          )}
          <div className="absolute left-2.5 top-2.5">
            {p?.inStock ? (
              <Badge className="gap-1 border-0 bg-emerald-600/95 text-white shadow-sm hover:bg-emerald-600">
                <PackageCheck className="h-3 w-3" /> In stock
              </Badge>
            ) : (
              <Badge className="gap-1 border-0 bg-stone-500/95 text-white shadow-sm hover:bg-stone-500">
                <PackageX className="h-3 w-3" /> Sold out
              </Badge>
            )}
          </div>
        </div>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
          {p?.brand}
        </p>
        <button
          type="button"
          onClick={() => onOpen?.(p)}
          className="mt-1 text-left"
        >
          <h3 className="line-clamp-1 font-display text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {p?.title}
          </h3>
        </button>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {p?.description}
        </p>

        <div className="mt-2 flex items-center gap-1.5">
          <StarRating rating={p?.rating} />
          <span className="text-xs font-medium text-foreground">
            {p?.rating != null ? p.rating.toFixed(1) : 'New'}
          </span>
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <MessageSquareText className="h-3 w-3" />
            {formatCount(p?.reviews)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(p?.tags ?? []).slice(0, 3).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick?.(tag)}
              className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium capitalize text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between pt-4">
          <span
            className={cn(
              'font-display text-lg font-bold tracking-tight',
              p?.price == null ? 'text-base text-muted-foreground' : 'text-foreground',
            )}
          >
            {formatPrice(p?.price)}
          </span>
          <button
            type="button"
            onClick={() => onOpen?.(p)}
            className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            View
          </button>
        </div>
      </div>
    </motion.div>
  )
}
