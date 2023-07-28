import { ProfileFragment, PublicationTypes } from '@lens-protocol/client'
import { useEffect, useState } from 'react'

import { OpportunityMetadata, PostTags, VHRRequest } from '../types'
import checkAuth from './checkAuth'
import getOpportunityMetadata from './getOpportunityMetadata'
import getVerifyMetadata from './getVerifyRequestMetadata'
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
      metadata: {
        tags: {
          oneOf: [
            /* "REJECT_VHR_REQUEST" */
          ]
        }
      }
    })
    .then(
      (values) =>
        values.items.filter(
          (value) => value.profile.ownedBy === params.profile.ownedBy
        ).length > 0
    )
}

interface getVHRRequestCommentsParams {
  publicationId: string
}
const getVHRRequestComments = (params: getVHRRequestCommentsParams) => {
  return lensClient().publication.fetchAll({
    commentsOf: params.publicationId,
    metadata: {
      tags: {
        all: [
          /* "VHR_REQUEST_OPPORTUNITY" */
        ]
      }
    }
  })
}

interface useVHRRequestsParams {
  profile: ProfileFragment | null
}

const useVHRRequests = (params: useVHRRequestsParams) => {
  const [requests, setRequests] = useState<VHRRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refetch = () => {
    let opportunities: (OpportunityMetadata & { id: string })[] = []

    setLoading(true)
    setError('')

    if (params.profile === null) {
      setError('Not signed in')
      setLoading(false)
      return
    }

    checkAuth(params.profile.ownedBy)
      .then(() =>
        lensClient().publication.fetchAll({
          profileId: params.profile!.id,
          publicationTypes: [PublicationTypes.Post],
          metadata: { tags: { all: [PostTags.OrgPublish.Opportunity] } }
        })
      )
      .then((res) => {
        opportunities = getOpportunityMetadata(res.items)
      })
      .then(() => {
        const collectedIds = getCollectedPostIds({ profile: params.profile! })

        const postsComments = opportunities.map((op) => {
          return getVHRRequestComments({ publicationId: op.id })
        })

        return Promise.all([collectedIds, ...postsComments])
      })
      .then(([collectedPostsIds, ...postsComments]) => {
        const data: VHRRequest[] = []

        postsComments.forEach(async (postComments, i) => {
          const filteredPosts = postComments.items.filter(async (p) => {
            const rejected = await getIsRequestRejected({
              profile: params.profile!,
              commentId: p.id
            })
            const accepted = !!collectedPostsIds.find((id) => p.id === id)

            return !(rejected || accepted)
          })

          const metadata = getVerifyMetadata(filteredPosts)

          metadata.forEach((p) => {
            const verifyRequest: VHRRequest = {
              opportunity: opportunities[i],
              hoursToVerify: p.hoursToVerify,
              comments: '',
              from: p.from,
              id: p.id,
              createdAt: p.createdAt
            }

            data.push(verifyRequest)
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
