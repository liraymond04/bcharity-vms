import { ProfileFragment, PublicationTypes } from '@lens-protocol/client'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ApplicationMetadata,
  ApplicationMetadataBuilder,
  getOpportunityMetadata,
  InvalidMetadataException,
  isComment,
  OpportunityMetadata,
  PostTags
} from '../metadata'
import { logIgnoreWarning } from '../metadata/get/logIgnoreWarning'
import lensClient from './lensClient'

interface GetIsRequestHandledParams {
  profileId: string
  commentId: string
}

const getIsRequestHandled = (params: GetIsRequestHandledParams) => {
  return lensClient()
    .publication.fetchAll({
      commentsOf: params.commentId,
      metadata: {
        tags: {
          oneOf: [PostTags.Application.REJECT, PostTags.Application.Accept]
        }
      }
    })
    .then((values) => {
      const filtered = values.items.filter(
        (value) => value.profile.id == params.profileId
      )
      return filtered.length > 0
    })
}

interface getApplicationCommentsParams {
  publicationId: string
}

const getApplicationComments = (params: getApplicationCommentsParams) => {
  return lensClient().publication.fetchAll({
    commentsOf: params.publicationId,
    metadata: { tags: { all: [PostTags.Application.Apply] } }
  })
}

interface UseApplicationsParams {
  profile: ProfileFragment | null
}

const useApplications = ({ profile }: UseApplicationsParams) => {
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const [applications, setApplications] = useState<ApplicationMetadata[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refetch = () => {
    if (!profile) {
      setError(e('profile-null'))
      return
    }
    let ops: OpportunityMetadata[] = []

    setLoading(true)
    setError('')

    lensClient()
      .publication.fetchAll({
        profileId: profile.id,
        publicationTypes: [PublicationTypes.Post],
        metadata: { tags: { all: [PostTags.OrgPublish.Opportunity] } }
      })
      .then((res) => {
        ops = getOpportunityMetadata(res.items)
      })
      .then(() => {
        const postsComments = ops.map((op) =>
          getApplicationComments({ publicationId: op.post_id })
        )

        return Promise.all(postsComments)
      })
      .then((postsComments) => {
        const statuses = postsComments.flatMap((comment) =>
          comment.items.map((c) =>
            getIsRequestHandled({
              profileId: profile.id,
              commentId: c.id
            }).then((value) => {
              return { k: c.id, v: value }
            })
          )
        )

        const statusMap: Record<string, boolean> = {}

        return Promise.all(statuses)
          .then((v) => v.forEach((p) => (statusMap[p.k] = p.v)))
          .then(() => {
            return { postsComments, statusMap }
          })
      })
      .then(({ postsComments, statusMap }) => {
        const data: ApplicationMetadata[] = []

        postsComments.forEach((postComments, i) => {
          console.log(postComments.items, statusMap)
          const filteredPosts = postComments.items
            .filter(isComment)
            .filter((p) => !p.hidden && !statusMap[p.id])

          filteredPosts.forEach((post) => {
            try {
              const builder = new ApplicationMetadataBuilder(post, ops[i])
              const request = builder.build()
              data.push(request)
            } catch (e) {
              if (e instanceof InvalidMetadataException) {
                logIgnoreWarning(post, e)
              } else {
                console.error(e)
              }
            }
          })
        })

        setApplications(data)
      })
      .catch((error) => {
        console.log(error)
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(refetch, [profile])

  return { refetch, data: applications, loading, error }
}

export default useApplications
