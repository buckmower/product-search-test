import { getStaticFacets } from '@/lib/products'
import { DiscoveryApp } from '@/components/discovery/discovery-app'

export const dynamic = 'force-static'

const HERO_IMAGE =
  'https://cdn.abacus.ai/images/b6ba9c9f-ae48-4bec-98b8-f6a8cf887b70.png'

export default function HomePage() {
  const facets = getStaticFacets()
  return <DiscoveryApp staticFacets={facets} heroImage={HERO_IMAGE} />
}
