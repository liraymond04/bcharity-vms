import { PhotographIcon } from '@heroicons/react/outline'
import { ProfileFragment } from '@lens-protocol/client'
import clsx from 'clsx'
import { FC, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardBody } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import { getProfile } from '@/lib/lens-protocol'
import { useAppPersistStore } from '@/store/app'

import NFTPicture from './NFTPicture'
import Picture from './Picture'

/**
 * Component with two tabs that lets the user set their profile picture
 * with an image file or an NFT.
 *
 * Setting the profile picture with an image file is handled with {@link Picture},
 * and setting the profile picture with an NFT is handled with {@link NFTPicture}.
 *
 * This component is used in {@link VolunteerHomeTab} to set the user's profile
 * picture.
 */
const SelectAvatar: FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.settings.home.select-avatar'
  })
  const { currentUser } = useAppPersistStore()

  const [profile, _setProfile] = useState<ProfileFragment>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [settingsType, setSettingsType] = useState<'NFT' | 'AVATAR'>('AVATAR')

  useEffect(() => {
    const _getProfile = async () => {
      setIsLoading(true)
      const _profile = await getProfile({ id: currentUser?.id ?? '' })
      if (_profile) _setProfile(_profile)
      setIsLoading(false)
    }

    if (currentUser?.id) _getProfile()
  }, [currentUser?.id])

  interface TypeButtonProps {
    name: string
    icon: ReactNode
    type: 'NFT' | 'AVATAR'
  }

  const TypeButton: FC<TypeButtonProps> = ({ name, icon, type }) => (
    <button
      type="button"
      onClick={() => {
        setSettingsType(type)
      }}
      className={clsx(
        {
          'text-brand bg-brand-100 dark:bg-Input dark:bg-opacity-20 bg-opacity-100 font-bold':
            settingsType === type
        },
        'flex items-center space-x-2 rounded-lg px-4 sm:px-3 py-2 sm:py-1 text-brand hover:bg-brand-100 dark:hover:bg-opacity-20 hover:bg-opacity-100'
      )}
    >
      {icon}
      <div className="hidden sm:block" suppressHydrationWarning>
        {name}
      </div>
    </button>
  )

  return isLoading ? (
    <Spinner />
  ) : (
    <Card>
      <CardBody className="space-y-5">
        <div className="flex items-center space-x-2">
          <TypeButton
            icon={<PhotographIcon className="w-5 h-5" />}
            type="AVATAR"
            name={t('upload-avatar')}
          />
          <TypeButton
            icon={<PhotographIcon className="w-5 h-5" />}
            type="NFT"
            name={t('nft-avatar')}
          />
        </div>
        {settingsType === 'NFT' ? (
          <NFTPicture profile={profile} />
        ) : (
          <Picture profile={profile} />
        )}
      </CardBody>
    </Card>
  )
}

export default SelectAvatar
