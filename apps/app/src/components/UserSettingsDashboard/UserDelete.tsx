import { TrashIcon } from '@heroicons/react/outline'
import Cookies from 'js-cookie'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDisconnect } from 'wagmi'

import { Card } from '@/components/UI/Card'
import { checkAuth, lensClient } from '@/lib/lens-protocol'
import { useAppPersistStore } from '@/store/app'

import GradientWrapper from '../Shared/Gradient/GradientWrapper'

const DeleteProfileSection: React.FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.settings.delete'
  })
  const { currentUser, setCurrentUser, setIsAuthenticated } =
    useAppPersistStore()
  const { disconnect } = useDisconnect()

  const handleClick = () => {
    if (currentUser) {
      checkAuth(currentUser.ownedBy)
        .then(() =>
          lensClient().profile.createBurnProfileTypedData({
            profileId: currentUser!.id
          })
        )
        .then((res) => {
          onCompleted()
        })
        .catch((err) => console.log(err))
    }
  }

  const onCompleted = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    localStorage.removeItem('lenster.store')
    if (disconnect) disconnect()
    location.href = '/'
  }

  return (
    <div>
      <Card>
        <GradientWrapper>
          <div className="pt-40 h-screen">
            <div className="bg-accent-content dark:bg-info-content shadow-md rounded-lg p-6 max-w-xl mx-auto">
              <div
                className="my-4 text-base font-bold"
                style={{ color: 'red' }}
                suppressHydrationWarning
              >
                {t('warning')}
              </div>
              <div className="mb-4 text-base" suppressHydrationWarning>
                {t('permanent')}
              </div>
              <div className="mb-2 text-base" suppressHydrationWarning>
                {t('upon-delete')}
              </div>
              <ul className="mx-8 mb-5 justify-left list-disc">
                <li suppressHydrationWarning>{t('not-recoverable')}</li>
                <li suppressHydrationWarning>{t('handle-released')}</li>
                <li suppressHydrationWarning>{t('info-available')}</li>
              </ul>
              <div className="flex justify-end">
                <div
                  onClick={handleClick}
                  className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
                >
                  <TrashIcon className="inline w-6 mr-2"></TrashIcon>
                  <p className="inline" suppressHydrationWarning>
                    {t('delete')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GradientWrapper>
      </Card>
    </div>
  )
}

export default DeleteProfileSection
