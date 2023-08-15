import WalletSelector from '@components/Shared/Navbar/Login/WalletSelector'
import Link from 'next/link'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IS_MAINNET, STATIC_ASSETS } from 'src/constants'

import Create from './Create'

const Login: FC = () => {
  const [hasConnected, setHasConnected] = useState<boolean>(false)
  const [hasProfile, setHasProfile] = useState<boolean>(true)
  const { t } = useTranslation('common', {
    keyPrefix: 'components.shared.navbar.login'
  })

  return (
    <div className="p-5">
      {hasProfile ? (
        <div className="space-y-5">
          {hasConnected ? (
            <div className="space-y-1">
              <div className="text-xl font-bold" suppressHydrationWarning>
                {t('sign')}
              </div>
              <div className="text-sm text-gray-500" suppressHydrationWarning>
                {t('verify')}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-xl font-bold" suppressHydrationWarning>
                {t('connect')}
              </div>
              <div className="text-sm text-gray-500" suppressHydrationWarning>
                {t('providers')}
              </div>
            </div>
          )}
          <WalletSelector
            setHasConnected={setHasConnected}
            setHasProfile={setHasProfile}
          />
        </div>
      ) : IS_MAINNET ? (
        <div>
          <div className="mb-2 space-y-4">
            <img
              className="w-16 h-16 rounded-full"
              height={64}
              width={64}
              src={`${STATIC_ASSETS}/brands/lens.png`}
              alt="Logo"
            />
            <div className="text-xl font-bold" suppressHydrationWarning>
              {t('claim')}
            </div>
            <div className="space-y-1">
              <div className="linkify" suppressHydrationWarning>
                {t('visit')}{' '}
                <Link
                  className="font-bold"
                  href="http://claim.lens.xyz"
                  target="_blank"
                  rel="noreferrer noopener"
                  suppressHydrationWarning
                >
                  {t('claiming-site')}
                </Link>{' '}
                {t('finish-claim')}
              </div>
              <div className="text-sm text-gray-500" suppressHydrationWarning>
                {t('return')}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Create isModal />
      )}
    </div>
  )
}

export default Login
