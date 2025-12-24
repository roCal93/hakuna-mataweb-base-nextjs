import { fetchAPI } from '@/lib/strapi'
import { getPageSEO } from '@/lib/seo'
import { draftMode } from 'next/headers'

// Génère le SEO pour la page d'accueil (Next.js 13+)
export async function generateMetadata({ searchParams }: { searchParams?: Promise<{ draft?: string }> } = {}) {
  // Récupérer le flag draft si présent en priorité via query, sinon via Draft Mode
  const sparams = searchParams ? await searchParams : undefined
  const { isEnabled: isDraftMode } = await draftMode()
  const isDraft = (sparams?.draft === 'true') || isDraftMode
  return getPageSEO('home', isDraft)
}

import { Layout } from '@/components/layout'
import { Hero } from '@/components/sections/Hero'
import { SectionGeneric } from '@/components/sections/SectionGeneric'
import { PageCollectionResponse } from '@/types/strapi'

export default async function Home({ searchParams }: { searchParams: Promise<{ draft?: string }> }) {
  // Lecture du paramètre draft dans l'URL (Next.js 15+) et draftMode
  const params = await searchParams
  const useDraftMode = process.env.USE_DRAFT_MODE === 'true'
  let isDraftMode = false
  if (useDraftMode) {
    isDraftMode = (await import('next/headers').then(m => m.draftMode())).isEnabled
  }
  const isDraft = (params?.draft === 'true') || isDraftMode

  const res: PageCollectionResponse = await fetchAPI(
    '/pages?filters[slug][$eq]=home&populate=sections.image',
    { draft: isDraft }
  )

  const allPagesRes: PageCollectionResponse = await fetchAPI('/pages')

  const page = res?.data?.[0]

  if (!page) {
    return (
      <Layout>
        <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>
          Erreur : page &quot;home&quot; introuvable dans Strapi.
        </div>
      </Layout>
    )
  }

  // --- Helpers pour les blocks Strapi
  type StrapiBlock = { children?: { text?: string }[] }[]

  const getText = (value: unknown) =>
    typeof value === 'string'
      ? value
      : ((value as StrapiBlock)?.[0]?.children?.[0]?.text ?? '')

  return (
    <Layout>
      <Hero
        title={getText(page.title)}
        subtitle={getText(page.heroContent)}
      />

      {page.sections?.map(section => (
        <SectionGeneric
          key={section.id}
          title={section.title}
          content={getText(section.content)}
          image={section.image?.url}
          reverse={section.reverse}
        />
      ))}
    </Layout>
  )
}
