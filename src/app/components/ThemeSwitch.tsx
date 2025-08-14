'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { useState, useEffect } from 'react'

export function ThemeSwitch() {
  const { theme, systemTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="ghost" className="flex items-center gap-2">
        <Monitor className="h-4 w-4" />
        <span>System</span>
      </Button>
    )
  }

  const effective = theme === 'system' ? systemTheme : theme

  const cycle = () => {
    if (theme === 'system') setTheme('light')
    else if (theme === 'light') setTheme('dark')
    else setTheme('system')
  }

  return (
    <Button
      variant="ghost"
      onClick={cycle}
      className="flex items-center gap-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
      title="Toggle theme (light / dark / system)"
    >
      {theme === 'system' ? (
        <>
          <Monitor className="h-4 w-4" />
          <span>System ({effective === 'dark' ? 'Dark' : 'Light'})</span>
        </>
      ) : effective === 'dark' ? (
        <>
          <Moon className="h-4 w-4" />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          <span>Light Mode</span>
        </>
      )}
    </Button>
  )
}
