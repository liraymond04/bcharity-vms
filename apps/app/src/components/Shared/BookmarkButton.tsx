import { BookmarkIcon } from '@heroicons/react/outline'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/solid'
import { FC, useEffect } from 'react'
import toast from 'react-hot-toast'

import useBookmark from '@/lib/lens-protocol/useBookmark'
import { useAppPersistStore } from '@/store/app'

import { Spinner } from '../UI/Spinner'

interface Props {
  publicationId: string
  postTag: string
}

const BookmarkButton: FC<Props> = ({ publicationId, postTag }) => {
  const { currentUser } = useAppPersistStore()
  const { fetch, bookmarked, error, isLoading, addBookmark, removeBookmark } =
    useBookmark({
      postTag
    })

  // custom hook
  // { bookmarked }, value is whether bookmarked or not, set on useEffect of hook
  //                 get latest comments under publication by currentuser to get bookmark value (custom post type and tag)
  //                 hide to unbookmark, (so if no publications found from those filters, then bookmarked = false)
  // { createBookmarkedPublication }, create comment under publication ID
  //                                  set metadata (doesn't need forms like the others, most is hardcoded)
  // { hideBookmarkedPublication }, check if has a publication after filters (custom post type and tag)
  //                                hide the publication if it exists

  useEffect(() => {
    if (error) toast.error(error?.message)
  }, [error])

  useEffect(() => {
    fetch(currentUser, publicationId)
  }, [])

  return (
    <button
      disabled={isLoading}
      onClick={() => {
        if (bookmarked) {
          removeBookmark(currentUser, publicationId)
        } else {
          addBookmark(currentUser, publicationId).then((result) => {
            if (result?.isFailure()) {
              console.log(result.error)
            }
          })
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
