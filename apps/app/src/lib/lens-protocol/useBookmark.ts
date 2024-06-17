import {
  // MetadataAttributeInput,
  ProfileFragment,
  PublicationMetadataMainFocusType,
  PublicationStatsInput
} from '@lens-protocol/client'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// import { v4 } from 'uuid'
// import { APP_NAME } from '@/constants'
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

export interface UseBookmarkReturn {
  /**
   * A way to refetch the bookmark data. THe promise is resolved when the data is done loading.
   */
  refetch: () => Promise<void>
  /**
   * Whether or not the post is bookmarked. Always false if `currentUser` is null
   */
  bookmarked: boolean
  /**
   * The error message if there was an error fetching bookmark data or add/removing a bookmark
   */
  error: string
  /**
   * Whether or not the data fetch or the add/remove bookmark result is pending
   */
  isLoading: boolean
  /**
   * Function to call to book mark the post. Sets errors if the post is already bookmarked or the currentUser is null
   */
  addBookmark: () => Promise<void>
  /**
   * A way to refetch the bookmark data. Sets errors if the currentUser is null
   */
  removeBookmark: () => Promise<void>
}

/**
 * A hook to handle bookmark-related functionality
 *
 * @param params the params for the hook
 *
 * @example Bookmark example
 * ```
 * // Adapted from BookmarkButton.tsx
 * const { bookmarked, error, isLoading, addBookmark, removeBookmark } =
 *   useBookmark({
 *     postTag,
 *     profile: currentUser,
 *     publicationId
 *   })
 *
 * return (
 *   <button
 *     disabled={isLoading}
 *     onClick={() => {
 *       if (bookmarked) {
 *         removeBookmark()
 *       } else {
 *         addBookmark()
 *       }
 *     }}
 *   >
 *     {isLoading ? (
 *       <Spinner size="sm" />
 *     ) : (
 *       <div className="transition duration-100 hover:scale-125">
 *         {bookmarked ? (
 *           <BookmarkSolid className="w-6 inline mb-1" />
 *         ) : (
 *           <BookmarkIcon className="w-6 inline mb-1" />
 *         )}
 *       </div>
 *     )}
 *   </button>
 * )
 * ```
 */
const useBookmark = (params: UseBookmarkParams): UseBookmarkReturn => {
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const { createComment } = useCreateComment()

  const [bookmarked, setBookmarked] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getComments = async (
    profile: ProfileFragment,
    publicationId: string
  ) => {
    const result = await lensClient().publication.fetchAll({
      where: { publicationIds: [publicationId] }
    })

    const comments = result.items
      .filter(isComment)
      .filter(
        (comment) => !comment.isHidden && comment.root === profile.ownedBy
      )

    return comments
  }

  const refetch = async () => {
    if (params.profile === null) {
      setBookmarked(false)
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const comments = await getComments(params.profile, params.publicationId)
      setBookmarked(comments.length > 0)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        console.error(e)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const addBookmark = async () => {
    if (params.profile === null) {
      setError(e('profile-null'))
      return
    }

    setIsLoading(true)
    setError('')

    // should be fine to remove this part if attributes is no longer part of metadata?
    // const attributes: MetadataAttributeInput[] = []
    const metadata: PublicationStatsInput = {
      metadata: {
        locale: getUserLocale(),
        tags: { all: [params.postTag] },
        mainContentFocus: [PublicationMetadataMainFocusType.TextOnly]
      }
      // version: '2.0.0',
      // metadata_id: v4(),
      // content: `#${params.postTag}`,
      // locale: getUserLocale(),
      // tags: [params.postTag],
      // mainContentFocus: PublicationMainFocus.TextOnly,
      // name: `${params.postTag} by ${params.profile.handle} for publication ${params.publicationId}`,
      // attributes,
      // appId: APP_NAME
    }

    try {
      await checkAuth(params.profile.ownedBy.toString(), params.profile.id)

      const comments = await getComments(params.profile, params.publicationId)
      if (comments.length > 0) {
        setError(e('already-bookmarked'))
        return
      }

      await createComment({
        publicationId: params.publicationId,
        profileId: params.profile.id,
        metadata
      })

      setBookmarked(true)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        console.error(e)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const removeBookmark = async () => {
    if (params.profile === null) {
      setError(e('profile-null'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await checkAuth(params.profile.ownedBy.toString(), params.profile.id)

      const comments = await getComments(params.profile, params.publicationId)

      const results = await Promise.all(
        comments.map((c) => lensClient().publication.hide({ for: c.id }))
      )

      let success = true

      results.forEach((res) => {
        if (res.isFailure() && success) {
          setError(res.error.message)
          success = false
        }
      })

      if (success) {
        setBookmarked(false)
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        console.log(e)
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
