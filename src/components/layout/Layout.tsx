import React, { ReactNode } from 'react'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'

type LayoutProps = {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
