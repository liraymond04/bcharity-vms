import { FC, useEffect } from 'react'
import { toast } from 'react-hot-toast'

import useFollow from '@/lib/lens-protocol/useFollow'
import { useAppPersistStore } from '@/store/app'

import { Button } from '../UI/Button'
import { Spinner } from '../UI/Spinner'

interface Props {
  followId: string
}

const FollowButton: FC<Props> = ({ followId }) => {
  const { currentUser } = useAppPersistStore()
  const { following, isLoading, error, followUser, unfollowUser } = useFollow({
    followerAddress: currentUser?.ownedBy ?? '',
    id: followId
  })

  useEffect(() => {
    if (error) toast.error(error?.message)
  }, [error])

  return (
    <Button
      disabled={isLoading}
      icon={isLoading && <Spinner size="sm" />}
      onClick={() => {
        if (!currentUser) return
        if (following) {
          unfollowUser(currentUser.ownedBy, followId)
        } else {
          followUser(currentUser.ownedBy, followId)
        }
      }}
      size="sm"
    >
      {following ? 'Unfollow' : 'Follow'}
    </Button>
  )
}

export default FollowButton
