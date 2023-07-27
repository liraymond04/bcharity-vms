import { signTypedData } from '@wagmi/core'
import { useEffect, useState } from 'react'

import checkAuth from './checkAuth'
import getSignature from './getSignature'
import lensClient from './lensClient'

interface Props {
  followerAddress: string
  id: string
}

const useFollow = (params: Props) => {
  const [following, setFollowing] = useState<boolean>()
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetch = async (followerAddress: string, id: string) => {
    setIsLoading(true)
    try {
      const result = await lensClient().profile.doesFollow({
        followInfos: [
          {
            followerAddress,
            profileId: id
          }
        ]
      })
      setFollowing(result[0].follows)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetch(params.followerAddress, params.id)
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
        setError(e)
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
        setError(e)
      }
    }
    setIsLoading(false)
  }

  return {
    following,
    error,
    isLoading,
    followUser,
    unfollowUser
  }
}

export default useFollow
