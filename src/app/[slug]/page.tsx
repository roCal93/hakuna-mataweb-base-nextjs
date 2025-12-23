import { Metadata } from 'next'
import { fetchAPI } from '@/lib/strapi'
import { Layout } from '@/components/layout/Layout'
import { Hero } from '@/components/sections/Hero'
import { SectionGeneric } from '@/components/sections/SectionGeneric'
import { PageCollectionResponse } from '@/types/strapi'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params
  
  const pageRes: PageCollectionResponse = await fetchAPI(
    `/pages?filters[slug][$eq]=${slug}&populate=seoImage`
  )

  const page = pageRes.data[0]

  if (!page) return {}

  // Convertir les blocs Strapi en texte pour la description
  const description = page.seoDescription
    ?.map(block => block.children?.map(child => child.text).join(''))
    .join(' ')

  return {
    title: page.seoTitle || page.title,
    description: description || page.title,
    openGraph: {
      title: page.seoTitle || page.title,
      description: description || page.title,
      images: page.seoImage?.url
        ? [page.seoImage.url]
        : [],
    },
  }
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

export default async function DynamicPage({ params }: Params) {
  // Dans Next.js 15+, params est une Promise
  const { slug } = await params

  // Redirige vers 404 si le slug est 'home'
  if (slug === 'home') {
    notFound()
  }

  // Récupérer la page par slug avec ses sections
  const pageRes: PageCollectionResponse = await fetchAPI(
    `/pages?filters[slug][$eq]=${slug}&populate=sections.image`
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

