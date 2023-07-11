import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { ArrowRightIcon } from '@heroicons/react/outline'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { IS_MAINNET } from 'src/constants'

interface Props {
  handle: string
  txHash: string
}

const Pending: FC<Props> = ({ handle, txHash }) => {
  const { t } = useTranslation('common')

  return <div className="p-5 font-bold text-center"></div>
}

export default Pending
