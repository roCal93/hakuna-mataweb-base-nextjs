// src/lib/seo.ts
import type { Metadata } from 'next'
import { fetchAPI } from './strapi'
import type { PageCollectionResponse } from '../types/strapi'

// --- Helper : construit le Metadata pour Next.js ---
export function buildMetadata({
  title,
  description,
  image,
  noIndex = false,
}: {
  title: string
  description?: string
  image?: string
  noIndex?: boolean
}): Metadata {
  return {
    title,
    description,
    robots: noIndex ? 'noindex' : 'index, follow',
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
    },
  }
}

// --- Helper : récupère le SEO depuis Strapi ---
export async function getPageSEO(slug: string, draft = false): Promise<Metadata | null> {
  try {
    const res = await fetchAPI<PageCollectionResponse>(
      `/pages?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=seoImage`,
      { draft }
    )

    // Strapi v5 : data[0] contient la page
    const page = res?.data?.[0]

    if (!page) return null

    // Gestion image (StrapiMedia ou undefined)
    let imageUrl: string | undefined = undefined
    if (page.seoImage && typeof page.seoImage === 'object') {
      imageUrl = page.seoImage.url
    }

    // Gestion description (StrapiBlock[] ou string)
    let description: string | undefined = undefined
    if (Array.isArray(page.seoDescription)) {
      // On extrait le texte des blocks (simple)
      description = page.seoDescription.map(b => b.children?.map(c => c.text).join(' ') ?? '').join(' ')
    } else if (typeof page.seoDescription === 'string') {
      description = page.seoDescription
    }

    return buildMetadata({
      title: page.seoTitle || page.title || 'Hakuna Mataweb',
      description,
      image: imageUrl,
      noIndex: page.noIndex,
    })
  } catch (error) {
    console.error('Erreur getPageSEO:', error)
    return null
  }
}
