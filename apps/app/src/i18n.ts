import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import zhCN from '../public/locales/common_chZN.json'
import store from '@components/utils/store'

// EN locale is provided by default
const en = {}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en'],
    keySeparator: false,
    interpolation: { escapeValue: false },

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
