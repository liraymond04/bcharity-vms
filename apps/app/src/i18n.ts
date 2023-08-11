import store from '@components/utils/store'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import en from '../public/locales/en.json'
import zhCN from '../public/locales/zh-CN.json'

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en'],

    resources: {
      en: {
        common: en
      },
      zhCN: {
        common: zhCN
      }
    }
  })

const language = store.get('i18nextLng') || 'en'
i18n.changeLanguage(language)
export default i18n
