import {
  isCommentPublication,
  isPostPublication,
  PublicationTypes
} from '@lens-protocol/client'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ApplicationMetadata,
  ApplicationMetadataBuilder,
  InvalidMetadataException,
  isComment,
  OpportunityMetadataBuilder,
  PostTags
} from '../metadata'
import { logIgnoreWarning } from '../metadata/get/logIgnoreWarning'
import lensClient from './lensClient'

interface UseRegisteredOpportunitiesParams {
  profileId: string | undefined
}

const useRegisteredOpportunities = ({
  profileId
}: UseRegisteredOpportunitiesParams) => {
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const [data, setData] = useState<ApplicationMetadata[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refetch = async () => {
    if (profileId) {
      setError(e('profile-null'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const apData = await lensClient().publication.fetchAll({
        profileId,
        publicationTypes: [PublicationTypes.Comment],
        metadata: { tags: { all: [PostTags.Application.Apply] } }
      })

      const applications = apData.items
        .map((a) => {
          if (!isComment(a) || a.hidden) return
          const { mainPost } = a
          if (!isPostPublication(mainPost)) return

          try {
            const op = new OpportunityMetadataBuilder(mainPost).build()
            const application = new ApplicationMetadataBuilder(a, op).build()
            return application
          } catch (e) {
            if (e instanceof InvalidMetadataException) {
              logIgnoreWarning(a, e)
            }
          }
        })
        .filter((a): a is ApplicationMetadata => !!a)

      const approvedMap: Record<string, boolean> = {}

      await Promise.all(
        applications.map(async (a) => {
          const comments = await lensClient()
            .publication.fetchAll({
              commentsOf: a.post_id,
              metadata: { tags: { all: [PostTags.Application.Accept] } }
            })
            .then((data) =>
              data.items
                .filter(isCommentPublication)
                .filter((c) => !c.hidden)
                .filter((c) => c.profile.id === a.opportunity.from.id)
            )

          approvedMap[a.post_id] = comments.length > 0
        })
      )

      setData(applications.filter((a) => approvedMap[a.post_id]))
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else if (typeof err === 'string') {
        setError(err)
      } else {
        console.log(err)
        setError(e('generic'))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [profileId])

  return { data, loading, error, refetch }
}

export default useRegisteredOpportunities
