import { useTheme } from 'next-themes'
import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import i18n from '@/i18n'

const TranslateButton: FC = () => {
  const { t } = useTranslation('common')
  const { theme, setTheme } = useTheme()
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(theme)
  }
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
      className={`flex ${
        lightTheme ? '' : 'justify-end'
      } rounded-full w-16 dark:bg-white bg-black`}
    >
      <div className="bg-gray-300 dark:bg-gray-600 rounded-full w-6 h-6 m-1" />
    </button>
  )
}

export default TranslateButton
