import {
  MetadataAttributeInput,
  ProfileFragment,
  PublicationMainFocus,
  PublicationMetadataV2Input
} from '@lens-protocol/client'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 } from 'uuid'

import { APP_NAME } from '@/constants'

import getUserLocale from '../getUserLocale'
import { isComment } from '../metadata'
import checkAuth from './checkAuth'
import lensClient from './lensClient'
import useCreateComment from './useCreateComment'

interface Props {
  postTag: string
}

const useBookmark = (params: Props) => {
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const { createComment } = useCreateComment()

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

    const comments = result.items
      .filter(isComment)
      .filter(
        (comment) =>
          !comment.hidden && comment.profile.ownedBy === profile.ownedBy
      )

    return comments
  }

  const fetch = async (profile: ProfileFragment | null, id: string) => {
    setIsLoading(true)
    try {
      if (profile === null) {
        throw Error(e('profile-null'))
      }

      const comments = await getComments(profile, id)

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
        throw Error(e('profile-null'))
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

      const comments = await getComments(profile, id)
      if (comments.length > 0) {
        throw Error(e('already-bookmarked'))
      }

      const result = await createComment({
        publicationId: id,
        profileId: profile.ownedBy,
        metadata
      })

      setBookmarked(true)
      return result
    } catch (e) {
      console.log(e)
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
        throw Error(e('profile-null'))
      }

      await checkAuth(profile.ownedBy)

      const result = await getComments(profile, id)
      const comments = result.filter(
        (comment) =>
          !comment.hidden && comment.profile.ownedBy === profile.ownedBy
      )

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
