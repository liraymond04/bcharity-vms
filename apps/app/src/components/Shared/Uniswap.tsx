import { LegacyFeeCollectModuleSettingsFragment } from '@lens-protocol/client'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import getUniswapURL from '@/lib/getUniswapURL'

/**
 * Properties of {@link Uniswap}
 */
export interface UniswapProps {
  /**
   * Fee collecte module used to get currency data
   */
  module: LegacyFeeCollectModuleSettingsFragment | undefined
}

/**
 * A component that displays a button to redirect a user to
 * swap their currency at Uniswap
 *
 * The component uses {@link getUniswapURL} to generate a
 * Uniswap link that autofills the currency swap details
 */
const Uniswap: FC<UniswapProps> = ({ module }) => {
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
          module?.amount?.asset?.name ?? ''
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
