import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles/globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import { GTMScript, GTMNoscript } from '../components/analytics/GTM'

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
        {/* Google Tag Manager */}
        <GTMScript />
        
        {/* Updated anti‑flicker script to honor system as default */}
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
      <body className={`${inter.className}`}>
        {/* Google Tag Manager (noscript) */}
        <GTMNoscript />
        
        {/* Default theme changed to system */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}