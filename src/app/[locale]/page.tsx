import { fetchAPI } from '@/lib/strapi'
import { getPageSEO } from '@/lib/seo'
import { draftMode } from 'next/headers'
import { Layout } from '@/components/layout'
import { Hero } from '@/components/sections/Hero'
import { SectionGeneric } from '@/components/sections/SectionGeneric'
import { PageCollectionResponse } from '@/types/strapi'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  // SEO per-locale could be implemented here
  return getPageSEO('home')
}

export default async function HomeLocale({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams?: { draft?: string } | Promise<{ draft?: string }> }) {
  const { locale } = await params

  const sparams = searchParams ? await Promise.resolve(searchParams) : undefined
  const isDraft = (sparams?.draft === 'true')

  const res: PageCollectionResponse = await fetchAPI(
    '/pages?filters[slug][$eq]=home&populate=sections.image',
    { draft: isDraft, locale }
  )

  const page = res?.data?.[0]

  if (!page) {
    return (
      <Layout>
        <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>
          Erreur : page "home" introuvable dans Strapi pour la locale {locale}.
        </div>
      </Layout>
    )
  }

  const getText = (value: unknown) =>
    typeof value === 'string'
      ? value
      : ((value as any)?.[0]?.children?.[0]?.text ?? '')

  return (
    <Layout>
      <Hero
        title={getText(page.title)}
        subtitle={getText(page.heroContent)}
      />

      {page.sections?.map((section: any) => (
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
