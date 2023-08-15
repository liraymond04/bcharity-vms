import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Privacypolicy: NextPage = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.privacy-policy'
  })

  return (
    <>
      <SEO title="Privacy Policy • BCharity VMS" />

      {/* Title + update the date here */}
      <div
        suppressHydrationWarning
        className="flex flex-col justify-center text-center border-b-8 border-indigo-700 dark:border-sky-200 border-dotted py-10 mx-32"
      >
        <div suppressHydrationWarning className="my-5 text-3xl font-bold">
          {t('title')}
        </div>
        <div
          suppressHydrationWarning
          className="flex justify-center m-4 text-1 text-gray-400 font-bold"
        >
          {t('updated-on')}
        </div>
      </div>

      {/* The Private Policy is written here: */}
      <div
        suppressHydrationWarning
        className="flex justify-left items-center border my-10 mx-32 dark:bg-Card"
      >
        <div suppressHydrationWarning className="flex my-8 mx-20 flex-col">
          <div suppressHydrationWarning className="space-y-10"></div>
          <div suppressHydrationWarning className="mb-2 text-base">
            {t('p1')}
          </div>
          <div suppressHydrationWarning className="mb-2 text-3xl font-bold">
            {t('p2')}
          </div>
          <div suppressHydrationWarning className="mb-2 text-base">
            {t('p3')}
          </div>
          <div suppressHydrationWarning className="mb-2 text-base">
            {t('p4')}
          </div>
          <ul className="mx-8 mb-5 list-disc">
            <li suppressHydrationWarning>{t('p5')}</li>
            <li suppressHydrationWarning>{t('p6')}</li>
            <li suppressHydrationWarning>{t('p7')}</li>
            <li suppressHydrationWarning>{t('p8')}</li>
          </ul>
          <div suppressHydrationWarning className="mb-2 text-3xl font-bold">
            {t('p9')}
          </div>
          <div suppressHydrationWarning className="mb-2 text-base">
            {t('p10')}
          </div>
          <ul className="mx-8 mb-5 list-disc">
            <li suppressHydrationWarning>{t('p11')}</li>
            <li suppressHydrationWarning>{t('p12')}</li>
          </ul>
          <div suppressHydrationWarning className="mb-2 text-3xl font-bold">
            {t('p13')}
          </div>
          <div suppressHydrationWarning className="mb-2 text-base">
            {t('p14')}
          </div>
          <div suppressHydrationWarning className="mb-2 text-base">
            {t('p15')}
          </div>
          <div suppressHydrationWarning className="mb-2 text-base">
            {t('p16')}
          </div>
          <div suppressHydrationWarning className="mb-2 text-base">
            {t('p17')}
          </div>
          <div suppressHydrationWarning className="mb-2 text-3xl font-bold">
            {t('p18')}
          </div>
          <div suppressHydrationWarning className="mb-2 text-base">
            {t('p19')}
          </div>
        </div>
      </div>
    </>
  )
}

export default Privacypolicy
