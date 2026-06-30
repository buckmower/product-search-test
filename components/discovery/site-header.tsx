'use client'

import { Search, X, Home } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
}

export function SiteHeader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-4 sm:gap-5 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Home className="h-5 w-5" />
          </span>
          <span className="hidden font-display text-lg font-bold tracking-tight text-foreground sm:block">
            Hearth & Home
          </span>
        </Link>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search rattan, linen, lamps, vases…"
            className="h-11 w-full rounded-full border border-input bg-card pl-11 pr-10 text-sm text-foreground shadow-[var(--shadow-sm)] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
            aria-label="Search products"
          />
          {value?.length > 0 && (
            <button
              type="button"
              onClick={() => {
                onChange('')
                inputRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
