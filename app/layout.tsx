import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

export const dynamic = 'force-static'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_PAGES === 'true' ? '/product-search-test' : '')
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Hearth & Home — Cozy Home Goods Discovery',
  description:
    'Discover beautifully crafted home goods. Search and filter thousands of cozy pieces for every corner of your home.',
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
  openGraph: {
    title: 'Hearth & Home — Cozy Home Goods Discovery',
    description:
      'Discover beautifully crafted home goods. Search and filter thousands of cozy pieces for every corner of your home.',
    images: [`${basePath}/og-image.png`],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
