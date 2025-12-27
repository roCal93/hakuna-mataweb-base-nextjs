'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export function LanguageSwitcher() {
  const pathname = usePathname() ?? '/'
  const segments = pathname.split('/')
  const currentSegment = segments[1]
  const currentLocale = currentSegment === 'fr' || currentSegment === 'en' ? currentSegment : 'fr'
  const otherLocale = currentLocale === 'fr' ? 'en' : 'fr'
  const newPath = '/' + [otherLocale, ...segments.slice(2)].filter(Boolean).join('/')

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <span style={{ fontWeight: 'bold' }}>{currentLocale.toUpperCase()}</span>
      <Link href={newPath} aria-label={`Passer en ${otherLocale}`} style={{ marginLeft: 8 }}>
        {otherLocale.toUpperCase()}
      </Link>
    </div>
  )
}
