'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { formatPrice } from '@/lib/format'

type Props = {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  onCommit?: (value: [number, number]) => void
}

export function PriceRangeSlider({ min, max, value, onChange, onCommit }: Props) {
  const safeMin = Number.isFinite(min) ? min : 0
  const safeMax = Number.isFinite(max) && max > safeMin ? max : safeMin + 1
  const v0 = Math.max(safeMin, Math.min(value?.[0] ?? safeMin, safeMax))
  const v1 = Math.max(safeMin, Math.min(value?.[1] ?? safeMax, safeMax))

  return (
    <div className="space-y-3">
      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center py-1"
        min={safeMin}
        max={safeMax}
        step={1}
        value={[v0, v1]}
        minStepsBetweenThumbs={1}
        onValueChange={(vals) => onChange?.([vals?.[0] ?? safeMin, vals?.[1] ?? safeMax])}
        onValueCommit={(vals) => onCommit?.([vals?.[0] ?? safeMin, vals?.[1] ?? safeMax])}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label="Minimum price"
          className="block h-4 w-4 rounded-full border-2 border-primary bg-card shadow-sm ring-offset-background transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <SliderPrimitive.Thumb
          aria-label="Maximum price"
          className="block h-4 w-4 rounded-full border-2 border-primary bg-card shadow-sm ring-offset-background transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </SliderPrimitive.Root>
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span className="rounded-md bg-secondary px-2 py-1 font-mono text-secondary-foreground">
          {formatPrice(v0)}
        </span>
        <span className="rounded-md bg-secondary px-2 py-1 font-mono text-secondary-foreground">
          {formatPrice(v1)}
        </span>
      </div>
    </div>
  )
}
