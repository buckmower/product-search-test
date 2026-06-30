'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function pageList(page: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | 'gap')[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)
  if (start > 2) pages.push('gap')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('gap')
  pages.push(total)
  return pages
}

export function PaginationBar({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null
  const pages = pageList(page, totalPages)

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-9 items-center gap-1 rounded-lg bg-card px-3 text-sm font-semibold text-foreground shadow-[var(--shadow-sm)] transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" /> Prev
      </button>
      <div className="hidden items-center gap-1.5 sm:flex">
        {pages.map((p, i) =>
          p === 'gap' ? (
            <span key={`gap-${i}`} className="px-1 text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                'h-9 min-w-9 rounded-lg px-3 text-sm font-semibold shadow-[var(--shadow-sm)] transition-colors',
                p === page
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground hover:bg-accent',
              )}
            >
              {p}
            </button>
          ),
        )}
      </div>
      <span className="px-2 text-sm font-medium text-muted-foreground sm:hidden">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-9 items-center gap-1 rounded-lg bg-card px-3 text-sm font-semibold text-foreground shadow-[var(--shadow-sm)] transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
