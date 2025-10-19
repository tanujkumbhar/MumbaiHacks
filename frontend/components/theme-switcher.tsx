'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg px-2 py-2 transition-all duration-200 group"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
      ) : (
        <Moon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
      )}
      <span className="hidden lg:ml-1.5 lg:inline font-medium text-xs">
        {isDark ? 'Light' : 'Dark'}
      </span>
    </Button>
  )
}
