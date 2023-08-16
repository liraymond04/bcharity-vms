import { BookmarkIcon } from '@heroicons/react/outline'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/solid'
import { FC, useEffect } from 'react'
import toast from 'react-hot-toast'

import { useBookmark } from '@/lib/lens-protocol'
import { useAppPersistStore } from '@/store/app'

import { Spinner } from '../UI/Spinner'

interface Props {
  publicationId: string
  postTag: string
}

const BookmarkButton: FC<Props> = ({ publicationId, postTag }) => {
  const { currentUser } = useAppPersistStore()
  const { bookmarked, error, isLoading, addBookmark, removeBookmark } =
    useBookmark({
      postTag,
      profile: currentUser,
      publicationId
    })

  useEffect(() => {
    if (error) toast.error(error?.message)
  }, [error])

  return (
    <button
      disabled={isLoading}
      onClick={() => {
        if (bookmarked) {
          removeBookmark()
        } else {
          addBookmark().then((result) => {
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
