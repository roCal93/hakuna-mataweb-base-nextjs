import { fetchAPI } from '@/lib/strapi'
import { getPageSEO } from '@/lib/seo'
import { Layout } from '@/components/layout/Layout'
import { Hero } from '@/components/sections/Hero'
import { SectionGeneric } from '@/components/sections/SectionGeneric'
import { PageCollectionResponse } from '@/types/strapi'
import { notFound } from 'next/navigation'

// Simplification : SEO dynamique via helper
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return getPageSEO(slug)
}

type Params = {
  params: Promise<{ slug: string }>
}

// Générer les routes statiques pour toutes les pages
export async function generateStaticParams() {
  const pageRes: PageCollectionResponse = await fetchAPI('/pages')
  
  return pageRes.data.map((page) => ({
    slug: page.slug,
  }))
}

export default async function DynamicPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ draft?: string }> }) {
  // Dans Next.js 15+, params et searchParams sont des Promise
  const { slug } = await params
  const sparams = await searchParams
  const useDraftMode = process.env.USE_DRAFT_MODE === 'true'
  let isDraftMode = false
  if (useDraftMode) {
    isDraftMode = (await import('next/headers').then(m => m.draftMode())).isEnabled
  }
  const isDraft = (sparams?.draft === 'true') || isDraftMode

  // Redirige vers 404 si le slug est 'home'
  if (slug === 'home') {
    notFound()
  }

  // Récupérer la page par slug avec ses sections
  const pageRes: PageCollectionResponse = await fetchAPI(
    `/pages?filters[slug][$eq]=${slug}&populate=sections.image`,
    { draft: isDraft }
  )

  if (!pageRes.data.length) {
    notFound()
  }

  const page = pageRes.data[0]
  const sections = (page.sections || []).sort((a, b) => a.order - b.order)

  return (
    <Layout>
      <Hero 
        title={page.title} 
        subtitle={page.heroContent?.map(block => block.children?.map(child => child.text).join('')).join('\n')} 
      />

      {sections.map(section => (
        <SectionGeneric
          key={section.id}
          title={section.title}
          content={section.content?.map(block => block.children?.map(child => child.text).join('')).join('\n') || ''}
          image={section.image?.url}
          reverse={section.reverse}
        />
      ))}
    </Layout>
  )
}

