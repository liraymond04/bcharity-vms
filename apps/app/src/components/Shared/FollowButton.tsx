import { FC, ReactNode, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import { useFollow } from '@/lib/lens-protocol'
import { useAppPersistStore } from '@/store/app'

import { Button } from '../UI/Button'
import { Spinner } from '../UI/Spinner'

/**
 * Properties of {@link FollowButton}
 */
export interface FollowButtonProps {
  /**
   * ID of profile to follow
   */
  followId: string
  /**
   * Icon component to render in button
   */
  icon?: ReactNode
  /**
   * Class names and tailwind styles passed to the component
   */
  className?: string
  /**
   * Size of button being rendered
   */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Component that displays a button to follow a profile
 *
 * The component uses the {@link useFollow} hook to check if the current user
 * is already following the profile, and provides functions to follow and
 * unfollow the user
 */
const FollowButton: FC<FollowButtonProps> = ({
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
    if (error) {
      toast.error(error)
    }
  }, [error])

  return (
    <Button
      disabled={isLoading}
      icon={isLoading ? <Spinner size="sm" /> : icon}
      onClick={() => {
        if (following) {
          unfollowUser()
        } else {
          followUser()
        }
      }}
      size={size}
      className={className}
    >
      {following ? t('unfollow') : t('follow')}
    </Button>
  )
}

export default FollowButton
