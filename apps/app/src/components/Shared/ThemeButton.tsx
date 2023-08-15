import { MoonIcon, SunIcon } from '@heroicons/react/outline'
import { useTheme } from 'next-themes'
import React, { FC, useEffect, useState } from 'react'

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
        <MoonIcon className="w-5 h-5" />
      ) : (
        <SunIcon className="w-5 h-5" />
      )}
    </button>
  )
}

export default ThemeButton
