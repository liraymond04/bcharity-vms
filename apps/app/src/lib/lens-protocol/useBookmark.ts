import {
  MetadataAttributeInput,
  ProfileFragment,
  PublicationMainFocus,
  PublicationMetadataV2Input
} from '@lens-protocol/client'
import { useStorageUpload } from '@thirdweb-dev/react'
import { signTypedData } from '@wagmi/core'
import { useEffect, useState } from 'react'
import { v4 } from 'uuid'

import { APP_NAME } from '@/constants'

import getUserLocale from '../getUserLocale'
import checkAuth from './checkAuth'
import getSignature from './getSignature'
import lensClient from './lensClient'

interface Props {
  postTag: string
}

const useBookmark = (params: Props) => {
  const { mutateAsync: upload } = useStorageUpload()

  const [bookmarked, setBookmarked] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState<boolean>()

  const getComments = async (profile: ProfileFragment, id: string) => {
    const result = await lensClient().publication.fetchAll({
      commentsOf: id,
      metadata: {
        tags: {
          oneOf: [params.postTag]
        }
      }
    })

    return result.items
  }

  const fetch = async (profile: ProfileFragment | null, id: string) => {
    setIsLoading(true)
    try {
      if (profile === null) {
        throw Error('Provided profile is null!')
      }

      const result = await getComments(profile, id)
      const comments = result.filter((comment) => !comment.hidden)

      if (comments.length > 0) {
        setBookmarked(true)
      } else {
        setBookmarked(false)
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const addBookmark = async (profile: ProfileFragment | null, id: string) => {
    setIsLoading(true)
    try {
      if (profile === null) {
        throw Error('Provided profile is null!')
      }

      const attributes: MetadataAttributeInput[] = []
      const metadata: PublicationMetadataV2Input = {
        version: '2.0.0',
        metadata_id: v4(),
        content: `#${params.postTag}`,
        locale: getUserLocale(),
        tags: [params.postTag],
        mainContentFocus: PublicationMainFocus.TextOnly,
        name: `${params.postTag} by ${profile.handle} for publication ${id}`,
        attributes,
        appId: APP_NAME
      }

      await checkAuth(profile.ownedBy)

      const result = await getComments(profile, id)
      const comments = result.filter((comment) => !comment.hidden)

      if (comments.length > 0) {
        throw Error('Publication has already been bookmarked!')
      }

      const contentURI = (await upload({ data: [metadata] }))[0]

      const typedDataResult =
        await lensClient().publication.createCommentTypedData({
          profileId: profile.id,
          publicationId: id,
          contentURI,
          collectModule: {
            freeCollectModule: {
              followerOnly: false
            }
          },
          referenceModule: { followerOnlyReferenceModule: false }
        })

      const signature = await signTypedData(
        getSignature(typedDataResult.unwrap().typedData)
      )

      const broadcastResult = await lensClient().transaction.broadcast({
        id: typedDataResult.unwrap().id,
        signature: signature
      })

      setBookmarked(true)

      return broadcastResult
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const removeBookmark = async (
    profile: ProfileFragment | null,
    id: string
  ) => {
    setIsLoading(true)
    try {
      if (profile === null) {
        throw Error('Provided profile is null!')
      }

      await checkAuth(profile.ownedBy)

      const result = await getComments(profile, id)
      const comments = result.filter((comment) => !comment.hidden)

      if (comments.length > 0) {
        comments.forEach(async (item) => {
          await lensClient().publication.hide({
            publicationId: item.id
          })
        })
      }
      setBookmarked(false)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // fetch(params.profile, params.id) // triggers infinite loop
  })

  return {
    fetch,
    bookmarked,
    error,
    isLoading,
    addBookmark,
    removeBookmark
  }
}

export default useBookmark
