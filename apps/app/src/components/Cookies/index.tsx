import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import React from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Component that displays a cookies policy page
 */
const Cookies: NextPage = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.cookies'
  })
  return (
    <>
      <SEO title="Cookies • BCharity VMS" />

      <div className="flex flex-col justify-center text-center border-b-8 border-indigo-700 dark:border-sky-200 border-dotted py-10 mx-32">
        <div>
          <div className="my-5 text-3xl font-bold" suppressHydrationWarning>
            {t('title')}
          </div>
          <div suppressHydrationWarning>{t('updated-on')}</div>
        </div>
      </div>
      <div className="flex justify-left items-center border my-10 mx-20 bg-purple-100 dark:bg-Card">
        <div className="flex my-8 mx-20 flex-col">
          <div className="space-y-3">
            <div suppressHydrationWarning>{t('content.p1')}</div>

            <div suppressHydrationWarning>{t('content.p2')}</div>

            <div className="my-5 text-3xl font-bold" suppressHydrationWarning>
              {t('content.h1')}
            </div>

            <div suppressHydrationWarning>{t('content.p3')}</div>

            <div className="my-5 text-3xl font-bold" suppressHydrationWarning>
              {t('content.h2')}
            </div>

            <div suppressHydrationWarning>{t('content.p4')}</div>

            <div className="my-5 text-3xl font-bold" suppressHydrationWarning>
              {t('content.h3')}
            </div>

            <div suppressHydrationWarning>{t('content.p5')}</div>

            <div className="my-5 text-3xl font-bold" suppressHydrationWarning>
              {t('content.h4')}
            </div>

            <div className="my-5 text-1xl font-bold" suppressHydrationWarning>
              {t('content.m1')}
            </div>

            <div suppressHydrationWarning>{t('content.p6')}</div>

            <div className="my-5 text-1xl font-bold" suppressHydrationWarning>
              {t('content.m2')}
            </div>

            <div suppressHydrationWarning>{t('content.p7')}</div>
          </div>

          <div className="my-5 text-3xl font-bold" suppressHydrationWarning>
            {t('content.h6')}
          </div>

          <div suppressHydrationWarning>{t('content.p8')}</div>
        </div>
      </div>
    </>
  )
}

export default Cookies
