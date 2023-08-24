import { MoonIcon, SunIcon } from '@heroicons/react/outline'
import { useTheme } from 'next-themes'
import React, { FC, useEffect, useState } from 'react'

/**
 * A component used to display a button that toggles the theme
 * between light mode and dark mode
 *
 * The component uses the useTheme hook from the 'next-themes' package
 * to handle theme switching
 */
const ThemeButton: FC = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    if (theme) setResolvedTheme(theme)
  }, [theme])

  const [resolvedTheme, setResolvedTheme] = useState<string>('light')

  return (
    <button
      className="btn btn-circle btn-outline btn-primary glass"
      onClick={toggleTheme}
    >
      {resolvedTheme === 'dark' ? (
        <MoonIcon className="w-5 h-5 stroke-slate-50" />
      ) : (
        <SunIcon className="w-5 h-5" />
      )}
    </button>
  )
}

export default ThemeButton
