import { fetchAPI } from '@/lib/strapi'
import { getPageSEO } from '@/lib/seo'
import { Layout } from '@/components/layout'
import { Hero } from '@/components/sections/Hero'
import { SectionGeneric } from '@/components/sections/SectionGeneric'
import { PageCollectionResponse, StrapiBlock } from '@/types/strapi'
import { notFound, redirect } from 'next/navigation'
import { locales as SUPPORTED_LOCALES } from '@/lib/locales'

type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params
  return getPageSEO(slug)
}

export const dynamicParams = true // Allow dynamic params for pages that might not exist yet

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string; slug: string }>, searchParams?: { draft?: string } | Promise<{ draft?: string }> }) {
  const { locale, slug } = await params

  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    notFound()
  }

  if (slug === 'home') {
    notFound()
  }

  const sparams = searchParams ? await Promise.resolve(searchParams) : undefined
  const isDraft = (sparams?.draft === 'true') || false

  const pageRes: PageCollectionResponse = await fetchAPI(
    `/pages?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=sections.image`,
    { draft: isDraft, locale }
  )

  if (!pageRes.data.length) {
    // Fallback: try without locale (global)
    const fallbackRes: PageCollectionResponse = await fetchAPI(
      `/pages?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=sections.image`,
      { draft: isDraft }
    )

    if (!fallbackRes.data.length) {
      // Nothing found in any locale → show 404 page
      notFound()
    }

    const fallbackPage = fallbackRes.data[0]

    // Redirect to the page in its original locale
    redirect(`/${fallbackPage.locale}/${slug}`)
  }

  const page = pageRes.data[0]
  const sections = (page.sections || []).sort((a, b) => (a.order || 0) - (b.order || 0))

  // Helper function to extract text from Strapi blocks
  const extractTextFromBlocks = (blocks: StrapiBlock[]): string => {
    return blocks
      .map(block =>
        block.children
          ?.map(child => child.text || '')
          .join('') || ''
      )
      .join('\n')
  }

  return (
    <Layout>
      <Hero
        title={page.title}
        subtitle={page.heroContent ? extractTextFromBlocks(page.heroContent) : undefined}
      />

      {sections.map((section) => (
        <SectionGeneric
          key={section.id}
          title={section.title}
          content={extractTextFromBlocks(section.content)}
          image={section.image?.url}
          reverse={section.reverse}
        />
      ))}
    </Layout>
  )
}
