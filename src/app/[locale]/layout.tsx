import React from 'react'
import { LangSetter, LanguageSwitcher } from '@/components/locale'

export const dynamic = 'force-dynamic'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  // Note: Locale validation is handled in individual pages/components
  // to allow the 404 page to render properly

  return (
    <>
      <LangSetter lang={locale} />
      <header style={{ padding: 20 }}>
        <LanguageSwitcher />
      </header>
      {children}
    </>
  )
}
