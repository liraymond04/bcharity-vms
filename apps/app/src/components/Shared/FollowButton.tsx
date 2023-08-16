import { FC, ReactNode, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { checkAuth, useFollow } from '@/lib/lens-protocol'
import { useAppPersistStore } from '@/store/app'

import { Button } from '../UI/Button'
import { Spinner } from '../UI/Spinner'

interface Props {
  followId: string
  icon?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const FollowButton: FC<Props> = ({
  followId,
  icon,
  className,
  size = 'sm'
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.shared.follow-button'
  })

  const { currentUser } = useAppPersistStore()
  const { following, isLoading, error, followUser, unfollowUser } = useFollow({
    followerAddress: currentUser?.ownedBy ?? '',
    profileId: followId
  })

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  return (
    <Button
      disabled={isLoading}
      icon={isLoading ? <Spinner size="sm" /> : icon}
      onClick={() => {
        if (!currentUser) return
        checkAuth(currentUser.ownedBy).then(() => {
          if (following) {
            unfollowUser()
          } else {
            followUser()
          }
        })
      }}
      size={size}
      className={className}
    >
      {following ? t('unfollow') : t('follow')}
    </Button>
  )
}

export default FollowButton
