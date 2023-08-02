import {
  CommentFragment,
  ProfileFragment,
  PublicationTypes
} from '@lens-protocol/client'
import { useEffect, useState } from 'react'

import {
  LogVhrRequestMetadata,
  LogVhrRequestMetadataBuilder,
  OpportunityMetadata
} from '../metadata'
import { PostTags } from '../types'
import getOpportunityMetadata from './getOpportunityMetadata'
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

interface useVHRRequestsParams {
  profile: ProfileFragment | null
}

const useVHRRequests = (params: useVHRRequestsParams) => {
  const [requests, setRequests] = useState<LogVhrRequestMetadata[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refetch = () => {
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
          return getVHRRequestComments({ publicationId: op.metadata_id })
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
          const filteredPosts = postComments.items.filter((p) => {
            const accepted = !!collectedPostsIds.find((id) => p.id === id)
            return !(rejectedPostMap[p.id] || accepted) && !p.hidden
          })

          filteredPosts.map((post) => {
            const request = new LogVhrRequestMetadataBuilder(
              post as CommentFragment,
              opportunities[i]
            ).build()

            data.push(request)
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
