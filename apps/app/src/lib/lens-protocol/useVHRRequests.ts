import {
  CommentFragment,
  ProfileFragment,
  PublicationTypes
} from '@lens-protocol/client'
import { useEffect, useState } from 'react'

import {
  InvalidMetadataException,
  isComment,
  LogVhrRequestMetadata,
  LogVhrRequestMetadataBuilder,
  OpportunityMetadata,
  PostTags
} from '../metadata'
import { getOpportunityMetadata } from '../metadata/get/getOpportunityMetadata'
import lensClient from './lensClient'

interface getCollectedPostIdsParams {
  profile: ProfileFragment
}

const getCollectedPostIds = (params: getCollectedPostIdsParams) => {
  return lensClient()
    .publication.fetchAll({
      collectedBy: params.profile.ownedBy,
      publicationTypes: [PublicationTypes.Comment]
    })
    .then((res) => res.items.map((i) => i.id))
}

interface getRejectedPostIdsParams {
  profile: ProfileFragment
  commentId: string
}

const getIsRequestRejected = (params: getRejectedPostIdsParams) => {
  return lensClient()
    .publication.fetchAll({
      commentsOf: params.commentId,
      metadata: { tags: { oneOf: [PostTags.VhrRequest.Reject] } }
    })
    .then((values) => {
      const filtered = values.items.filter((value) => {
        return value.profile.ownedBy == params.profile.ownedBy
      })
      return filtered.length > 0
    })
}

interface getVHRRequestCommentsParams {
  publicationId: string
}

const getVHRRequestComments = (params: getVHRRequestCommentsParams) => {
  return lensClient().publication.fetchAll({
    commentsOf: params.publicationId,
    metadata: { tags: { all: [PostTags.VhrRequest.Opportunity] } }
  })
}

interface UseVHRRequestsParams {
  profile: ProfileFragment | null
}

/**
 *
 * @param params Params for the request
 * @returns `loading`: whether or not the data is loading, \
 *          `data`: the {@link LogVhrRequestMetadata} of VHR requests that have not been handled yet \
 *          `error`: error message (if request fails), \
 *          `refetch`: function that triggers the data to refetch
 */
const useVHRRequests = (params: UseVHRRequestsParams) => {
  const [requests, setRequests] = useState<LogVhrRequestMetadata[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refetch = () => {
    if (!params.profile) return
    let opportunities: OpportunityMetadata[] = []

    setLoading(true)
    setError('')

    if (params.profile === null) {
      setError('Not signed in')
      setLoading(false)
      return
    }

    lensClient()
      .publication.fetchAll({
        profileId: params.profile!.id,
        publicationTypes: [PublicationTypes.Post],
        metadata: { tags: { all: [PostTags.OrgPublish.Opportunity] } }
      })
      .then((res) => {
        opportunities = getOpportunityMetadata(res.items)
      })
      .then(() => {
        const collectedIds = getCollectedPostIds({ profile: params.profile! })

        const postsComments = opportunities.map((op) => {
          return getVHRRequestComments({ publicationId: op.post_id })
        })

        return Promise.all([collectedIds, ...postsComments])
      })
      .then(([collectedPostsIds, ...postsComments]) => {
        const rejectedPostPromises = postsComments
          .map((comment) => {
            return comment.items.map((c) =>
              getIsRequestRejected({
                profile: params.profile!,
                commentId: c.id
              }).then((value) => {
                return { k: c.id, v: value }
              })
            )
          })
          .flat(1)

        const rejectedPostMap: Record<string, boolean> = {}

        return Promise.all(rejectedPostPromises)
          .then((v) => {
            v.map((p) => {
              rejectedPostMap[p.k] = p.v
            })
          })
          .then(() => {
            return { collectedPostsIds, postsComments, rejectedPostMap }
          })
      })
      .then(({ collectedPostsIds, postsComments, rejectedPostMap }) => {
        const data: LogVhrRequestMetadata[] = []

        postsComments.forEach((postComments, i) => {
          const filteredPosts = postComments.items
            .filter(isComment)
            .filter((p) => {
              const accepted = !!collectedPostsIds.find((id) => p.id === id)
              return !(rejectedPostMap[p.id] || accepted) && !p.hidden
            })

          filteredPosts.map((post) => {
            try {
              const request = new LogVhrRequestMetadataBuilder(
                post as CommentFragment,
                opportunities[i]
              ).build()

              data.push(request)
            } catch (e) {
              console.debug(
                'warning: ignored metadata from post %o due to error %o',
                (post as CommentFragment).metadata,
                (e as unknown as InvalidMetadataException).message
              )
              return null
            }
          })
        })

        setRequests(data)
      })
      .catch((error) => {
        console.log(error)
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(refetch, [params.profile])

  return {
    loading,
    data: requests,
    error,
    refetch
  }
}

export default useVHRRequests
