import React from 'react'
import { Button } from '@/components/ui/Button'

export const Header = () => {
  return (
    <header className="flex justify-between items-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold">Hakuna Mataweb</h1>
      <nav className="space-x-4">
        <Button variant="secondary">Accueil</Button>
        <Button variant="secondary">Projets</Button>
        <Button variant="secondary">Contact</Button>
      </nav>
    </header>
  )
}
