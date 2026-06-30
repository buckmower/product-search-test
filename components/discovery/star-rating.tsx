'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  rating: number | null
  size?: number
  className?: string
}

export function StarRating({ rating, size = 14, className }: Props) {
  const safe = Math.max(0, Math.min(5, rating ?? 0))
  const full = Math.floor(safe)
  const hasHalf = safe - full >= 0.25 && safe - full < 0.75
  const roundedUp = safe - full >= 0.75
  const effectiveFull = roundedUp ? full + 1 : full

  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = i < effectiveFull
        const isHalf = !roundedUp && hasHalf && i === full
        return (
          <span key={i} className="relative inline-flex">
            <Star
              width={size}
              height={size}
              className="text-amber-300"
              fill="currentColor"
              strokeWidth={0}
              style={{ opacity: 0.35 }}
            />
            {(isFull || isHalf) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: isHalf ? '50%' : '100%' }}
              >
                <Star
                  width={size}
                  height={size}
                  className="text-amber-500"
                  fill="currentColor"
                  strokeWidth={0}
                />
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}
