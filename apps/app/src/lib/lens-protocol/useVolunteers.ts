import {
  CommentFragment,
  isCommentPublication,
  isPostPublication,
  PostFragment,
  ProfileFragment,
  PublicationTypes
} from '@lens-protocol/client'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ApplicationMetadata,
  ApplicationMetadataBuilder,
  getOpportunityMetadata,
  InvalidMetadataException,
  LogVhrRequestMetadata,
  LogVhrRequestMetadataBuilder,
  OpportunityMetadata,
  PostTags
} from '../metadata'
import { logIgnoreWarning } from '../metadata/get/logIgnoreWarning'
import lensClient from './lensClient'

export type VolunteerData = {
  profile: ProfileFragment
  currentOpportunities: OpportunityMetadata[]
  completedOpportunities: LogVhrRequestMetadata[]
}

interface getCollectedPostIdsParams {
  profile: ProfileFragment
}

const getCollectedPosts = (params: getCollectedPostIdsParams) => {
  return lensClient()
    .publication.fetchAll({
      collectedBy: params.profile.ownedBy,
      publicationTypes: [PublicationTypes.Comment]
    })
    .then((res) => res.items)
}

/**
 * Returned by the {@link useVolunteers} hook
 */
export interface UseVolunteersReturn {
  /**
   * The volunteer data
   */
  data: VolunteerData[]
  /**
   * Whether or not the volunteer data is loading
   */
  loading: boolean
  /**
   * The error message if an error occured while attempting to fetch the data
   */
  error: string
  /**
   * A function to call to refetch the data
   */
  refetch: () => Promise<void>
}

/**
 * Params for the {@link useVolunteers} hook
 */
export interface UseVolunteersParams {
  /**
   * The profile to fetch data for, returned as { currentUser } in useAppPersistStore()
   */
  profile: ProfileFragment | null
}

/**
 * React hook for the management page in the Organization dashboard
 *
 * @param params Parameters for the hook
 */
export const useVolunteers = ({
  profile
}: UseVolunteersParams): UseVolunteersReturn => {
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const [data, setData] = useState<VolunteerData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refetch = async () => {
    if (!profile) {
      setError(e('profile-null'))
      return
    }

    setLoading(true)
    setError('')

    const apAcceptCommentsData = (
      await lensClient().publication.fetchAll({
        profileId: profile.id,
        publicationTypes: [PublicationTypes.Comment],
        metadata: {
          tags: { all: [PostTags.Application.Accept] }
        }
      })
    ).items.filter(isCommentPublication)

    const vhrCollectData = (await getCollectedPosts({ profile })).filter(
      isCommentPublication
    )

    const opData: PostFragment[] = []

    opData.push(
      ...apAcceptCommentsData.map((d) => d.mainPost).filter(isPostPublication)
    )

    opData.push(
      ...vhrCollectData.map((d) => d.mainPost).filter(isPostPublication)
    )

    const ops = getOpportunityMetadata(opData)

    const opMap = new Map<string, OpportunityMetadata>(
      ops.map((o) => [o.post_id, o])
    )

    const filteredApAcceptComments = apAcceptCommentsData.filter((a) =>
      opMap.has(a.mainPost.id)
    )

    const filteredColData = vhrCollectData.filter((a) =>
      opMap.has(a.mainPost.id)
    )

    const applicationIdOpportunityIdMap = new Map<string, string>(
      filteredApAcceptComments
        .map((v) => [v.commentOn?.id, v.mainPost.id])
        .filter((pair): pair is [string, string] => !!pair[0] && !!pair[1])
    )

    const applicationDataComments = filteredApAcceptComments
      .map((a) => a.commentOn)
      .filter((a): a is CommentFragment => !!a && isCommentPublication(a))

    const applications = applicationDataComments
      .map((a) => {
        try {
          const opId = applicationIdOpportunityIdMap.get(a.id)
          if (!opId) throw new InvalidMetadataException('Invalid metadata') // exception should never be thrown because it is filtered with opMap.has(a.mainPost.id) but here just in case
          const op = opMap.get(opId) // 2nd level down, does not have mainPost
          if (!op) throw new InvalidMetadataException('Invalid metadata') // exception should never be thrown because it is filtered with opMap.has(a.mainPost.id) but here just in case
          return new ApplicationMetadataBuilder(a, op).build()
        } catch (e) {
          if (e instanceof InvalidMetadataException) {
            logIgnoreWarning(a, e)
          } else {
            console.error(e)
          }
          return null
        }
      })
      .filter((a): a is ApplicationMetadata => !!a)

    const vhrRequests = filteredColData
      .map((a) => {
        console.log('test a', a)
        try {
          const op = opMap.get(a.mainPost.id)
          if (!op) throw new InvalidMetadataException('Invalid metadata') // exception should never be thrown because it is filtered with opMap.has(a.mainPost.id) but here just in case
          return new LogVhrRequestMetadataBuilder(a, op).build()
        } catch (e) {
          if (e instanceof InvalidMetadataException) {
            logIgnoreWarning(a, e)
          } else {
            console.error(e)
          }
          return null
        }
      })
      .filter((a): a is LogVhrRequestMetadata => !!a)

    const volunteerDataMap = new Map<string, VolunteerData>()

    applications.forEach((a) => {
      const id = a.from.id
      if (!volunteerDataMap.has(id)) {
        volunteerDataMap.set(id, {
          profile: a.from,
          currentOpportunities: [],
          completedOpportunities: []
        })
      }

      const prev = volunteerDataMap.get(id)!
      const newOps = [...prev.currentOpportunities, a.opportunity] // a volunteer can only register once so no risk of duplicates
      volunteerDataMap.set(id, { ...prev, currentOpportunities: newOps })
    })

    vhrRequests.forEach((a) => {
      const id = a.from.id
      if (!volunteerDataMap.has(id)) {
        volunteerDataMap.set(id, {
          profile: a.from,
          currentOpportunities: [],
          completedOpportunities: []
        })
      }

      const prev = volunteerDataMap.get(id)!
      const newComp = [...prev.completedOpportunities, a]
      volunteerDataMap.set(id, { ...prev, completedOpportunities: newComp })
    })

    setData(Array.from(volunteerDataMap.values()))
  }

  useEffect(() => {
    refetch()
  }, [profile])

  return {
    data,
    loading,
    error,
    refetch
  }
}
