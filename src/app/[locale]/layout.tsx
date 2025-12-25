import React from 'react'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/locales'
import { LangSetter } from '@/components/LangSetter'

export const dynamic = 'force-dynamic'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return (
    <>
      <LangSetter lang={locale} />
      {children}
    </>
  )
}
