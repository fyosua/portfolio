'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  // ensure enableSystem passes through (RootLayout now supplies it)
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}