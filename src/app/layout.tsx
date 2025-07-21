import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles/globals.css'
import { ThemeProvider } from './components/ThemeProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://yosuaf.com'),
  title: 'Yosua Ferdian | Technical Specialist',
  description: 'Portfolio of Yosua Ferdian. Expert in Google Tracking solutions and web development.',
  openGraph: {
    title: 'Yosua Ferdian | Technical Specialist',
    description: 'Expert in Google Tracking solutions and web development.',
    url: 'https://yosuaf.com',
    siteName: 'Yosua Ferdian Portfolio',
    images: [
      {
        url: '/images/og-image.png', // Next.js will now correctly combine this with metadataBase
        width: 1200,
        height: 630,
        alt: 'Yosua Ferdian Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yosua Ferdian | Technical Specialist',
    description: 'Expert in Google Tracking solutions and web development.',
    images: ['/images/og-image.png'], // This will also be resolved correctly
  },
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent theme flicker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}