import { FeeCollectModuleSettingsFragment } from '@lens-protocol/client'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import getUniswapURL from '@/lib/getUniswapURL'

interface Props {
  module: FeeCollectModuleSettingsFragment | undefined
}

const Uniswap: FC<Props> = ({ module }) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.shared.uniswap'
  })
  return (
    <div className="space-y-1">
      <div className="text-sm" suppressHydrationWarning>
        {t('not-enough')} <b>{module?.amount?.asset?.symbol}</b>
      </div>
      <a
        href={getUniswapURL(
          parseFloat(module?.amount?.value ?? ''),
          module?.amount?.asset?.address ?? ''
        )}
        className="flex items-center space-x-1.5 text-xs font-bold text-pink-500"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          src="/uniswap.png"
          className="w-5 h-5"
          height={20}
          width={20}
          alt="Uniswap"
          suppressHydrationWarning
        />
        <div>{t('swap')}</div>
      </a>
    </div>
  )
}

export default Uniswap
