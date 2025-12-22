import React from 'react'
import Image from 'next/image'

type CardProps = {
  title: string
  description: string
  image?: string
}

export const Card = ({ title, description, image }: CardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow p-4 bg-white">
      {image && (
        <div className="relative w-full h-40 mb-4">
          <Image 
            src={image} 
            alt={title} 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  )
}
