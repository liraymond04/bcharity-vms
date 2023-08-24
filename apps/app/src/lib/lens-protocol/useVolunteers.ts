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

/**
 * Volunteer data provided to application
 */
export type VolunteerData = {
  /**
   * Lens profile fragment of volunteer
   */
  profile: ProfileFragment
  /**
   * Array of accepted volunteer applications
   */
  currentOpportunities: OpportunityMetadata[]
  /**
   * Array of accepted log VHR requests
   */
  completedOpportunities: LogVhrRequestMetadata[]
  /**
   * ISO date string of when volunteer application accepted
   */
  dateJoined: string
}

const makeEmptyVolunteerData = (profile: ProfileFragment): VolunteerData => {
  return {
    profile,
    currentOpportunities: [],
    completedOpportunities: [],
    dateJoined: ''
  }
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

    // structure
    //                        a.commentOn            doesn't work
    // application accept comment -> application comment -x-> opportunity post
    //
    //                        a.mainPost
    // application accept comment -> opportunity post
    //
    //                   a.mainPost
    // vhr request comment -> opportunity post

    const filteredApAcceptComments = apAcceptCommentsData
      .filter((a) => opMap.has(a.mainPost.id))
      .filter((a) => !!a.commentOn && isCommentPublication(a.commentOn))

    const filteredColData = vhrCollectData.filter((a) =>
      opMap.has(a.mainPost.id)
    )

    const dateJoinedMap = new Map<string, string>([
      ...filteredApAcceptComments
        .map((v) => [v.commentOn?.id, v.createdAt])
        .filter((pair): pair is [string, string] => !!pair[0] && !!pair[1]),
      ...filteredColData
        .map((v) => [v.id, v.createdAt])
        .filter((pair): pair is [string, string] => !!pair[0] && !!pair[1])
    ])

    const applications = filteredApAcceptComments
      .map((a) => [a.commentOn, a.mainPost] as [CommentFragment, PostFragment])
      .map(([a, opPost]) => {
        try {
          const opId = opPost.id
          const op = opMap.get(opId)

          if (!op) {
            throw new InvalidMetadataException('Invalid metadata') // exception should never be thrown because it is filtered with opMap.has(a.mainPost.id) but here just in case
          }

          const app = new ApplicationMetadataBuilder(a, op).build()
          return app
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
      const postId = a.post_id
      const profileId = a.from.id
      if (!volunteerDataMap.has(profileId)) {
        volunteerDataMap.set(profileId, makeEmptyVolunteerData(a.from))
      }

      const prev = volunteerDataMap.get(profileId)!
      const newOps = [...prev.currentOpportunities, a.opportunity] // a volunteer can only register once so no risk of duplicates
      const currentDate = dateJoinedMap.get(postId)

      let newDate = prev.dateJoined
      if (
        currentDate &&
        (prev.dateJoined === '' ||
          new Date(prev.dateJoined).getTime() > new Date().getTime())
      ) {
        newDate = currentDate
      }
      volunteerDataMap.set(profileId, {
        ...prev,
        currentOpportunities: newOps,
        dateJoined: newDate
      })
    })

    vhrRequests.forEach((a) => {
      const postId = a.post_id
      const profileId = a.from.id
      if (!volunteerDataMap.has(profileId)) {
        volunteerDataMap.set(profileId, makeEmptyVolunteerData(a.from))
      }

      const prev = volunteerDataMap.get(profileId)!
      const newComp = [...prev.completedOpportunities, a]
      const currentDate = dateJoinedMap.get(postId)

      let newDate = prev.dateJoined
      if (currentDate) {
        newDate =
          !prev.dateJoined ||
          new Date(prev.dateJoined).getTime() > new Date().getTime()
            ? newDate
            : currentDate
      }

      volunteerDataMap.set(profileId, {
        ...prev,
        completedOpportunities: newComp,
        dateJoined: newDate
      })
    })

    setData(Array.from(volunteerDataMap.values()))
    setLoading(false)
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
