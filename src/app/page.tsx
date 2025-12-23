import { fetchAPI } from '@/lib/strapi'
import { Layout } from '@/components/layout'
import { Hero } from '@/components/sections/Hero'
import { SectionGeneric } from '@/components/sections/SectionGeneric'
import { PageCollectionResponse, SectionCollectionResponse } from '@/types/strapi'

export default async function Home() {
  // Récupérer la page principale
  const pageRes: PageCollectionResponse = await fetchAPI('/pages?populate=*')
  const page = pageRes?.data?.[0]

  // Récupérer les sections
  const sectionsRes: SectionCollectionResponse = await fetchAPI('/sections?populate=*&sort=order:asc')
  const sections = sectionsRes.data.filter((section): section is NonNullable<typeof section> => section !== null && section !== undefined)

  // Extract plain text from Strapi blocks
  type StrapiBlock = { children?: { text?: string }[] }[]
  const title = page
    ? (typeof page.title === 'string'
        ? page.title
        : ((page.title as StrapiBlock)?.[0]?.children?.[0]?.text || ''))
    : 'Page non trouvée'
  const subtitle = page
    ? (typeof page.heroContent === 'string'
        ? page.heroContent
        : ((page.heroContent as StrapiBlock)?.[0]?.children?.[0]?.text || ''))
    : ''

  if (!page) {
    return (
      <Layout>
        <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>
          Erreur : aucune page d'accueil trouvée dans Strapi.
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Hero title={title} subtitle={subtitle} />

      {sections.map(section => {
        const sectionContent = typeof section.content === 'string' ? section.content : ((section.content as StrapiBlock)?.[0]?.children?.[0]?.text || '')
        const imageUrl = section.image?.url
        return (
          <SectionGeneric
            key={section.id}
            title={section.title}
            content={sectionContent}
            image={imageUrl}
            reverse={section.reverse}
          />
        )
      })}
    </Layout>
  )
}
