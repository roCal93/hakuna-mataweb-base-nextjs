const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

type FetchOptions = RequestInit & {
  cache?: RequestCache
}

export async function fetchAPI<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  if (!STRAPI_URL) {
    throw new Error('STRAPI URL manquante')
  }

  const url = `${STRAPI_URL}/api${path}`

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_TOKEN && {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      }),
    },
    cache: 'no-store',
    ...options,
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error)
  }

  return res.json() as Promise<T>
}
