import React from 'react'
import Image from 'next/image'

type SectionGenericProps = {
  title: string
  content: string
  image?: string
  reverse?: boolean
}

export const SectionGeneric = ({ title, content, image, reverse = false }: SectionGenericProps) => {
  return (
    <section className={`flex flex-col md:flex-row ${reverse ? 'md:flex-row-reverse' : ''} items-center my-8`}>
      {image && <Image src={image} alt={title} width={800} height={600} className="w-full md:w-1/2 h-auto object-cover" />}
      <div className="md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700">{content}</p>
      </div>
    </section>
  )
}
