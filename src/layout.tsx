// src/layout.tsx
import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const font = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: "Digital Transformation Solutions"
  },
  description: 'Enhance your business with digital transformation, API integration, and machine learning. Improve SEO, automate customer journeys, and gain insights from your data.',
  keywords: [
    'Digital Transformation',
    "website developers near me",
    "website development company in New York",
    // Other keywords...
  ],
  author: 'Your Company Name',
  openGraph: {
    title: 'Digital Transformation Solutions',
    description: 'Enhance your business with digital transformation, API integration, and machine learning. Improve SEO, automate customer journeys, and gain insights from your data.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 800,
        height: 600,
        alt: 'Digital Transformation'
      }
    ],
    type: 'website',
    site_name: 'Your Company Name'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourcompany',
    title: 'Digital Transformation Solutions',
    description: 'Enhance your business with web development, digital transformation, and API integration. Improve SEO, automate customer journeys, and gain insights from your data.',
    image: '/opengraph-image.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={font.className}>{children}</body>
    </html>
  )
}
