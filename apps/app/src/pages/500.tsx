import { Button } from '@components/UI/Button'
import SEO from '@components/utils/SEO'
import { HomeIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function Custom500() {
  const { t } = useTranslation('common')
  return (
    <div className="flex-col page-center">
      <SEO title="500 • BCharity VMS" />
      <h1 className="mb-4 text-5xl font-bold">500 Internal Server Error</h1>
      <div className="py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          {t('Looks like something went wrong!')}
        </h1>
        <div className="mb-4 text-gray-500">
          {t(
            'We track these errors automatically, but if the problem persists feel free to contact us. In the meantime, try refreshing.'
          )}
        </div>
        <Link href="/">
          <Button
            className="flex mx-auto item-center"
            size="lg"
            icon={<HomeIcon className="w-4 h-4" />}
          >
            <div>{t('Go Home')}</div>
          </Button>
        </Link>
      </div>
    </div>
  )
}
