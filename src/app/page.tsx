import { fetchAPI } from '@/lib/strapi'
import { Layout } from '@/components/layout'
import { Hero } from '@/components/sections/Hero'
import { SectionGeneric } from '@/components/sections/SectionGeneric'
import { PageCollectionResponse } from '@/types/strapi'

export default async function Home() {
  const res: PageCollectionResponse = await fetchAPI(
    '/pages?filters[slug][$eq]=home&populate=sections.image'
  )

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
