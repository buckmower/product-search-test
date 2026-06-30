'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import {
  PackageCheck,
  PackageX,
  ImageOff,
  MessageSquareText,
  Tag,
  Store,
  CalendarDays,
} from 'lucide-react'
import type { Product } from '@/lib/products'
import { StarRating } from './star-rating'
import { formatPrice, formatNumber } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Props = {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTagClick?: (tag: string) => void
}

function formatDate(value: string | null): string {
  if (!value) return 'Unknown'
  const d = new Date(value + 'T00:00:00Z')
  if (isNaN(d.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(d)
}

export function ProductQuickView({ product, open, onOpenChange, onTagClick }: Props) {
  const [imgError, setImgError] = useState(false)
  useEffect(() => setImgError(false), [product?.id])
  const p = product

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        {p && (
          <div className="grid max-h-[85vh] grid-cols-1 overflow-y-auto md:grid-cols-2">
            <div className="relative aspect-square w-full bg-muted md:aspect-auto md:min-h-[420px]">
              {p.image && !imgError ? (
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  onError={() => setImgError(true)}
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <ImageOff className="h-10 w-10" />
                </div>
              )}
            </div>

            <div className="flex flex-col p-6">
              <DialogHeader className="space-y-1 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary/80">
                  <Store className="h-3.5 w-3.5" />
                  {p.brand}
                  <span className="text-muted-foreground">· {p.category}</span>
                </div>
                <DialogTitle className="font-display text-2xl font-bold tracking-tight">
                  {p.title}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-3 flex items-center gap-2">
                <StarRating rating={p.rating} size={16} />
                <span className="text-sm font-semibold">
                  {p.rating != null ? p.rating.toFixed(1) : 'New'}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageSquareText className="h-3.5 w-3.5" />
                  {formatNumber(p.reviews)} reviews
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {p.description || 'No description available for this item.'}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {(p.tags ?? []).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      onTagClick?.(tag)
                      onOpenChange(false)
                    }}
                    className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium capitalize text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-3 text-sm">
                {p.inStock ? (
                  <Badge className="gap-1 border-0 bg-emerald-600 text-white hover:bg-emerald-600">
                    <PackageCheck className="h-3.5 w-3.5" /> In stock
                  </Badge>
                ) : (
                  <Badge className="gap-1 border-0 bg-stone-500 text-white hover:bg-stone-500">
                    <PackageX className="h-3.5 w-3.5" /> Sold out
                  </Badge>
                )}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Released {formatDate(p.releasedAt)}
                </span>
              </div>

              <div className="mt-auto flex items-end justify-between pt-6">
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-display text-3xl font-bold tracking-tight text-foreground">
                    {formatPrice(p.price)}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!p.inStock}
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {p.inStock ? 'Add to cart' : 'Notify me'}
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
