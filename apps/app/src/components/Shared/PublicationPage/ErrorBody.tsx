import { HomeIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/UI/Button'

interface IErrorBodyProps {
  message: string
}
const ErrorBody: React.FC<IErrorBodyProps> = ({ message }) => {
  const { t } = useTranslation('common', { keyPrefix: 'errors' })

  return (
    <div className="py-10 text-center">
      <h1 className="mb-4 text-3xl font-bold" suppressHydrationWarning>
        {t('something-wrong')}
      </h1>
      <div className="mb-4" suppressHydrationWarning>
        {message}
      </div>
      <Link href="/">
        <Button
          className="flex mx-auto item-center"
          size="lg"
          icon={<HomeIcon className="w-4 h-4" />}
        >
          {t('go-home')}
        </Button>
      </Link>
    </div>
  )
}

export default ErrorBody
