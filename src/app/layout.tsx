import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles/globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import { GoogleTagManager } from '@next/third-parties/google'

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
        url: '/images/website_logo.jpeg',
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
    images: ['/images/website_logo.jpeg'],
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
        {/* Anti‑flicker script to honor system as default */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');     // 'light' | 'dark' | 'system' | null
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  // Default = system
                  if (!stored || stored === 'system') {
                    if (prefersDark) document.documentElement.classList.add('dark');
                    else document.documentElement.classList.remove('dark');
                    return;
                  }
                  if (stored === 'dark') document.documentElement.classList.add('dark');
                  else document.documentElement.classList.remove('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      <body className={`${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}