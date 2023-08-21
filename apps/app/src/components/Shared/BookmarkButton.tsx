import { BookmarkIcon } from '@heroicons/react/outline'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/solid'
import { FC, useEffect } from 'react'
import toast from 'react-hot-toast'

import { useBookmark } from '@/lib/lens-protocol'
import { useAppPersistStore } from '@/store/app'

import { Spinner } from '../UI/Spinner'

/**
 * Properties of {@link BookmarkButton}
 */
export interface BookmarkButtonProps {
  /**
   * Publication ID of the post being bookmarked
   */
  publicationId: string
  /**
   * Post tag to be used for the bookmark comment
   */
  postTag: string
}

/**
 * A component that displays a button as a bookmark icon and handles bookmarking and
 * unbookmarking posts as well as their error messages using the {@link useBookmark}
 * hook
 *
 * @example Bookmark button used in the {@link components.Volunteers.VolunteerPage}
 * ```tsx
 * <BookmarkButton
 *   publicationId={opportunity.post_id}
 *   postTag={PostTags.Bookmark.Opportunity}
 * />
 * ```
 */
const BookmarkButton: FC<BookmarkButtonProps> = ({
  publicationId,
  postTag
}) => {
  const { currentUser } = useAppPersistStore()
  const { bookmarked, error, isLoading, addBookmark, removeBookmark } =
    useBookmark({
      postTag,
      profile: currentUser,
      publicationId
    })

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  return (
    <button
      disabled={isLoading}
      onClick={() => {
        if (bookmarked) {
          removeBookmark()
        } else {
          addBookmark()
        }
      }}
    >
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <div className="transition duration-100 hover:scale-125">
          {bookmarked ? (
            <BookmarkSolid className="w-6 inline mb-1" />
          ) : (
            <BookmarkIcon className="w-6 inline mb-1" />
          )}
        </div>
      )}
    </button>
  )
}

export default BookmarkButton
