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

export interface UseBookmarkParams {
  /**
   * The post tag for the type of bookmark
   */
  postTag: string
  /**
   * The profile of the user, or null
   */
  profile: ProfileFragment | null
  /**
   * The id of the publication to manage
   */
  publicationId: string
}

/**
 * A hook to handle bookmark-related functionality
 *
 * @param params the params for the hook
 *
 * @returns bookmarked - whether or not the post is bookmarked. Always false if currentUser is null \
 * isLoading - whether or not the data fetch or the add/remove bookmark is pending \
 * error - the error message if there was an error fetching bookmark data or add/removing a bookmark \
 * refetch - a way to refetch the bookmark data \
 * addBookmark - function to call to book mark the post. Throws errors if the post is already bookmarked or the currentUser is null \
 * removeBookmark - a way to refetch the bookmark data. Throws error if the currentUser is null
 */
const useBookmark = (params: UseBookmarkParams) => {
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const { createComment } = useCreateComment()

  const [bookmarked, setBookmarked] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState<boolean>()

  const getComments = async (
    profile: ProfileFragment,
    publicationId: string
  ) => {
    const result = await lensClient().publication.fetchAll({
      commentsOf: publicationId,
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

  const refetch = async () => {
    if (params.profile === null) {
      setBookmarked(false)
      return
    }

    setIsLoading(true)
    try {
      const comments = await getComments(params.profile, params.publicationId)

      setBookmarked(comments.length > 0)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const addBookmark = async () => {
    setIsLoading(true)
    try {
      if (params.profile === null) {
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
        name: `${params.postTag} by ${params.profile.handle} for publication ${params.publicationId}`,
        attributes,
        appId: APP_NAME
      }

      await checkAuth(params.profile.ownedBy)

      const comments = await getComments(params.profile, params.publicationId)
      if (comments.length > 0) {
        throw Error(e('already-bookmarked'))
      }

      const result = await createComment({
        publicationId: params.publicationId,
        profileId: params.profile.id,
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

  const removeBookmark = async () => {
    setIsLoading(true)
    try {
      if (params.profile === null) {
        throw Error(e('profile-null'))
      }

      await checkAuth(params.profile.ownedBy)

      const comments = await getComments(params.profile, params.publicationId)

      await Promise.all(
        comments.map((c) =>
          lensClient().publication.hide({ publicationId: c.id })
        )
      )
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
    refetch()
  }, [params.profile, params.publicationId])

  return {
    refetch,
    bookmarked,
    error,
    isLoading,
    addBookmark,
    removeBookmark
  }
}

export default useBookmark
