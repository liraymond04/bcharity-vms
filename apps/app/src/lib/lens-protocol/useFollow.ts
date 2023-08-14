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

//  * @returns `following` - whether or not the `followerAddress` follows the `profileId` \
//  *          `error` - the error message if an error occured when fetching the follow data, or attempting to (un)follow a user \
//  *    `     `isLoading` - whether or not the follow data is being fetched or if the hook is attempting to (un)follow a user \
//  *          `followUser`- a function to follow a user \
//  *          `unfollowUser` - a function to unfollow a user

/**
 * React hook to handle following-relating fetching and actions. Requires authentication beforehand.
 *
 * also see {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Profile.html#doesFollow | doesFollow}
 * , {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Profile.html#createFollowTypedData | createFollowTypedData}
 * , {@link https://lens-protocol.github.io/lens-sdk/classes/_lens_protocol_client.Profile.html#createUnfollowTypedData | createUnfollowTypedData}
 * @param params Params for the hook
 */
const useFollow = (params: UseFollowParams) => {
  const [following, setFollowing] = useState<boolean>()
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
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetch(params.followerAddress, params.profileId)
  }, [])

  const followUser = async (address: string, profileId: string) => {
    setIsLoading(true)
    try {
      await checkAuth(address)

      const typedDataResult = await lensClient().profile.createFollowTypedData({
        follow: [
          {
            profile: profileId
          }
        ]
      })

      const signature = await signTypedData(
        getSignature(typedDataResult.unwrap().typedData)
      )

      const broadcastResult = await lensClient().transaction.broadcast({
        id: typedDataResult.unwrap().id,
        signature: signature
      })

      setFollowing(true)
      setIsLoading(false)

      return broadcastResult
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      }
    }
    setIsLoading(false)
  }

  const unfollowUser = async (address: string, profileId: string) => {
    setIsLoading(true)
    try {
      await checkAuth(address)

      const typedDataResult =
        await lensClient().profile.createUnfollowTypedData({
          profile: profileId
        })

      const signature = await signTypedData(
        getSignature(typedDataResult.unwrap().typedData)
      )

      const broadcastResult = await lensClient().transaction.broadcast({
        id: typedDataResult.unwrap().id,
        signature: signature
      })

      setFollowing(false)
      setIsLoading(false)

      return broadcastResult
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
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
