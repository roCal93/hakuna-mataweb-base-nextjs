'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [lang, setLang] = useState<'fr' | 'en' | undefined>(undefined)

  useEffect(() => {
    try {
      const docLang = document.documentElement.lang
      if (docLang === 'en' || docLang === 'fr') {
        queueMicrotask(() => setLang(docLang as 'en' | 'fr'))
        return
      }

      const parts = window.location.pathname.split('/').filter(Boolean)
      if (parts[0] === 'en' || parts[0] === 'fr') {
        queueMicrotask(() => setLang(parts[0] as 'en' | 'fr'))
      }
    } catch {
      // noop
    }
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
      aria-labelledby="notfound-title"
    >
      <h1 id="notfound-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        404
      </h1>

      <p style={{ marginBottom: '1.5rem', color: '#374151' }}>
        {!lang ? "Cette page n'existe pas. / This page doesn't exist." : lang === 'en' ? "This page doesn't exist." : 'Cette page n\'existe pas.'}
      </p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Link
          href={`/${lang || 'fr'}`}
          style={{
            padding: '12px 24px',
            background: '#000',
            color: '#fff',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          {lang === 'en' ? 'Home' : "Retour à l’accueil"}
        </Link>
      </div>
    </main>
  )
}
