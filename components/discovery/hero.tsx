'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

type Props = {
  heroImage: string
  totalProducts: number
  categories: string[]
  onCategoryClick: (category: string) => void
  onSuggestionClick: (term: string) => void
}

const SUGGESTIONS = ['handwoven', 'terracotta', 'linen', 'brass', 'marble', 'rattan']

export function Hero({
  heroImage,
  totalProducts,
  categories,
  onCategoryClick,
  onSuggestionClick,
}: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="A warm, sunlit living space styled with cozy home goods"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {new Intl.NumberFormat('en-US').format(totalProducts)} curated pieces
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            Find pieces that make a house feel like{' '}
            <span className="text-primary">home</span>.
          </h1>
          <p className="mt-3 max-w-md text-base text-muted-foreground sm:text-lg">
            Search and filter thousands of beautifully crafted home goods — from woven
            storage to hand-thrown ceramics. Start typing above to discover yours.
          </p>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Popular right now
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSuggestionClick(s)}
                  className="rounded-full bg-card/90 px-3 py-1.5 text-sm font-medium capitalize text-foreground shadow-[var(--shadow-sm)] backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 flex flex-wrap gap-2"
        >
          {(categories ?? []).slice(0, 10).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCategoryClick(c)}
              className="rounded-xl bg-card/80 px-4 py-2 text-sm font-semibold text-foreground shadow-[var(--shadow-sm)] backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-accent"
            >
              {c}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
