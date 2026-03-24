import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Carlton AI Services',
    template: '%s | Carlton AI',
  },
  description: 'AI-powered business solutions that drive real results.',
  metadataBase: new URL('https://pages.carltonaiservices.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Carlton AI Services',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-navy-950 text-white font-sans">
        {children}
      </body>
    </html>
  )
}
