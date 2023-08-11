import { Button } from '@components/UI/Button'
import SEO from '@components/utils/SEO'
import { HomeIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function Custom500() {
  const { t } = useTranslation('common', { keyPrefix: '500' })
  return (
    <div className="flex-col page-center">
      <SEO title="500 • BCharity VMS" />
      <h1 className="mb-4 text-5xl font-bold">500 Internal Server Error</h1>
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold" suppressHydrationWarning>
          {t('something-wrong')}
        </h1>
        <div className="mb-4 text-gray-500" suppressHydrationWarning>
          {t('status-message')}
        </div>
        <Link href="/">
          <Button
            className="flex mx-auto item-center"
            size="lg"
            icon={<HomeIcon className="w-4 h-4" />}
          >
            <div suppressHydrationWarning>{t('go-home')}</div>
          </Button>
        </Link>
      </div>
    </div>
  )
}
