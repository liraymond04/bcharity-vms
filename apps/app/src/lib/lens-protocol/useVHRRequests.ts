import { ProfileFragment, PublicationTypes } from '@lens-protocol/client'
import { useEffect, useState } from 'react'

import { OpportunityMetadata, PostTags, VHRRequest } from '../types'
import checkAuth from './checkAuth'
import getOpportunityMetadata from './getOpportunityMetadata'
import lensClient from './lensClient'

interface getCollectedPostIdsParams {
  profile: ProfileFragment
}

// const getPaginatedData = async <T>(data: PaginatedResult<T>) => {
//   let d: PaginatedResult<T> | null = data

//   const ret = []

//   while (d) {
//     ret.push(...d.items)
//     d = await d.next()
//   }

//   return ret
// }

const getCollectedPostIds = (params: getCollectedPostIdsParams) => {
  return (
    lensClient()
      .publication.fetchAll({
        collectedBy: params.profile.ownedBy,
        publicationTypes: [PublicationTypes.Comment]
      })
      // .then((res) => getPaginatedData(res))
      .then((res) => res.items.map((i) => i.id))
  )
}

interface getRejectedPostIdsParams {
  profile: ProfileFragment
  commentId: string
}

const getIsRequestRejected = (params: getRejectedPostIdsParams) => {
  return (
    lensClient()
      .publication.fetchAll({
        profileId: params.profile.id,
        commentsOf: params.commentId,
        publicationTypes: [PublicationTypes.Post],
        metadata: {
          tags: {
            oneOf: [
              /* "REJECT_VHR_REQUEST" */
            ]
          }
        }
      })
      // .then((res) => getPaginatedData(res))
      .then((values) => values.items.length > 0)
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
          metadata: { tags: { all: [PostTags.OrgPublish.Opportuntiy] } }
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
        console.log('test', collectedPostsIds, postsComments)
        const data: VHRRequest[] = []
        postsComments.forEach(async (postComments, i) => {
          postComments.items
            .filter((p) => true) // TODO get metadata of post comment, including hours and comment id
            .filter(
              (p) =>
                !getIsRequestRejected({
                  profile: params.profile!,
                  commentId: p.id
                }) && !collectedPostsIds.find((id) => p.id === id)
            )
            .forEach((p) => {
              data.push({
                opportunity: opportunities[i],
                hours: 10,
                comment: '',
                from: opportunities[i].from,
                id: p.id,
                createdAt: p.createdAt
              })
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

  useEffect(refetch, [])

  return {
    loading,
    data: requests,
    error,
    refetch
  }
}

export default useVHRRequests
