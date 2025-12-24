const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

type FetchOptions = RequestInit & {
  cache?: RequestCache
}

// Fonction utilitaire Strapi v5 avec gestion du draft et du token preview
export async function fetchAPI<T = unknown>(
  path: string,
  { draft = false, ...options }: { draft?: boolean } & FetchOptions = {}
): Promise<T> {
  if (!STRAPI_URL) {
    throw new Error('STRAPI URL manquante')
  }

  let url = `${STRAPI_URL}/api${path}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // Sélection du token : preview si draft=true et disponible, sinon public
  if (draft && process.env.STRAPI_PREVIEW_TOKEN) {
    headers.Authorization = `Bearer ${process.env.STRAPI_PREVIEW_TOKEN}`
    // Demander les source maps utiles pour le Live Preview
    ;(headers as Record<string, string>)['strapi-encode-source-maps'] = 'true'
    // Pour Strapi preview : demander l'état preview et le status draft
    url += url.includes('?') ? '&publicationState=preview&status=draft' : '?publicationState=preview&status=draft'
  } else if (STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`
  }

  const res = await fetch(url, {
    headers,
    cache: draft ? 'no-store' : 'force-cache',
    ...options,
  })

  if (!res.ok) {
    throw new Error(`Erreur Strapi: ${res.status} ${res.statusText}`)
  }

  const text = await res.text()
  try {
    return JSON.parse(text) as T
  } catch (e) {
    throw new Error('Réponse non JSON : ' + text.slice(0, 200))
  }
}
