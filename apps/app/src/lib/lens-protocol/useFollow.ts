import { isRelayerError, RelayerResultFragment } from '@lens-protocol/client'
import { signTypedData } from '@wagmi/core'
import { useEffect, useState } from 'react'

import checkAuth from './checkAuth'
import getSignature from './getSignature'
import lensClient from './lensClient'

export interface UseFollowParams {
  /**
   * The ethereum address of the profile to follow
   */
  profileId: string
  /**
   * The ethereum address of the profile that is doing the following
   */
  followerAddress: string
}

export interface UseFollowReturn {
  /**
   * whether or not the followerAddress follows the profileId
   */
  following: boolean
  /**
   * The error message if an error occured when fetching the follow data, or attempting to (un)follow a user
   */
  error: string
  /**
   * Whether or not the follow data is being fetched or if the hook is attempting to (un)follow a user
   */
  isLoading: boolean
  /**
   * The function to execute to follow a user
   * @returns
   */
  followUser: () => Promise<RelayerResultFragment | undefined>
  /**
   * The function to execute to follow a user
   * @returns
   */
  unfollowUser: () => Promise<RelayerResultFragment | undefined>
}

/**
 * React hook to handle following-relating fetching and actions. Requires authentication beforehand.
 *
 * also see {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Profile.html#doesFollow | doesFollow}
 * , {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Profile.html#createFollowTypedData | createFollowTypedData}
 * , {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Profile.html#createUnfollowTypedData | createUnfollowTypedData}
 * @param params Params for the hook
 * @example A follow button
 *  // Adapted from FollowButton.tsx
 *  const { following, isLoading, error, followUser, unfollowUser } = useFollow({
 *    followerAddress: currentUser?.ownedBy ?? '',
 *    profileId: followId
 *  })
 *  ...
 *  return (
 *    <Button
 *      disabled={isLoading}
 *      onClick={() => {
 *        if (!currentUser) return
 *        checkAuth(currentUser.ownedBy).then(() => {
 *          if (following) {
 *            unfollowUser(currentUser.ownedBy, followId)
 *          } else {
 *            followUser(currentUser.ownedBy, followId)
 *          }
 *        })
 *      }}
 *    >
 *      {following ? t('unfollow') : t('follow')}
 *    </Button>
 *  )
 *
 */
const useFollow = (params: UseFollowParams): UseFollowReturn => {
  const [following, setFollowing] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetch = async (followerAddress: string, id: string) => {
    setIsLoading(true)
    try {
      if (followerAddress) {
        const result = await lensClient().profile.doesFollow({
          followInfos: [
            {
              followerAddress,
              profileId: id
            }
          ]
        })
        setFollowing(result[0].follows)
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        console.error(e)
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetch(params.followerAddress, params.profileId)
  }, [])

  const followUser = async () => {
    setIsLoading(true)
    try {
      await checkAuth(params.followerAddress)

      const typedDataResult = await lensClient().profile.createFollowTypedData({
        follow: [{ profile: params.profileId }]
      })

      const signature = await signTypedData(
        getSignature(typedDataResult.unwrap().typedData)
      )

      const broadcastResult = await lensClient().transaction.broadcast({
        id: typedDataResult.unwrap().id,
        signature: signature
      })

      if (broadcastResult.isFailure()) {
        setError(broadcastResult.error.message)
      } else if (isRelayerError(broadcastResult.value)) {
        setError(broadcastResult.value.reason)
      } else {
        setFollowing(true)
        return broadcastResult.value
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        console.error(e)
      }
    }
    setIsLoading(false)
  }

  const unfollowUser = async () => {
    setIsLoading(true)
    try {
      await checkAuth(params.followerAddress)

      const typedDataResult =
        await lensClient().profile.createUnfollowTypedData({
          profile: params.profileId
        })

      const signature = await signTypedData(
        getSignature(typedDataResult.unwrap().typedData)
      )

      const broadcastResult = await lensClient().transaction.broadcast({
        id: typedDataResult.unwrap().id,
        signature: signature
      })

      if (broadcastResult.isFailure()) {
        setError(broadcastResult.error.message)
      } else if (isRelayerError(broadcastResult.value)) {
        setError(broadcastResult.value.reason)
      } else {
        setFollowing(true)
        return broadcastResult.value
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        console.error(e)
      }
    }
    setIsLoading(false)
  }

  return {
    // whether or not test
    following,
    error,
    isLoading,
    followUser,
    unfollowUser
  }
}

export default useFollow
