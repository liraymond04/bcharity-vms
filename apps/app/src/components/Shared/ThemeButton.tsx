import { MoonIcon, SunIcon } from '@heroicons/react/outline'
import { useTheme } from 'next-themes'
import React, { FC, useEffect, useState } from 'react'

const ThemeButton: FC = () => {
  const { theme, setTheme } = useTheme()
  const [lightTheme, setLightTheme] = useState<boolean>(true)
  useEffect(() => {
    if (theme === 'light') {
      setLightTheme(true)
    } else {
      setLightTheme(false)
    }
  }, [theme])
  return (
    <button
      onClick={() => {
        if (lightTheme) {
          setTheme('dark')
        } else {
          setTheme('light')
        }
      }}
    >
      <div
        className={`flex items-center w-[70px] h-fit rounded-full ${
          lightTheme ? 'justify-start bg-gray-200' : 'justify-end bg-gray-600'
        }`}
      >
        <div
          className={`flex items-center justify-around w-[30px] h-[30px] my-1 rounded-full mx-1 ${
            lightTheme ? 'bg-white' : 'bg-black'
          }`}
        >
          {lightTheme ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </div>
      </div>
    </button>
  )
}

export default ThemeButton
