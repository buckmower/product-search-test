// Deterministic formatting helpers (explicit locale to keep SSR/CSR consistent).
const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatPrice(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return 'Price on request'
  return priceFormatter.format(value)
}

export function formatCount(value: number | null | undefined): string {
  const n = value ?? 0
  if (n < 1000) return String(n)
  return compactFormatter.format(n)
}

export function formatNumber(value: number | null | undefined): string {
  return new Intl.NumberFormat('en-US').format(value ?? 0)
}

export function titleCase(value: string | null | undefined): string {
  const v = (value ?? '').trim()
  if (!v) return ''
  return v.replace(/\b([a-z])/g, (m) => m.toUpperCase())
}
