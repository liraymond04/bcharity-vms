import {
  CommentFragment,
  isCommentPublication,
  OpenActionFilter,
  PostFragment,
  ProfileFragment,
  PublicationType
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
  const address: OpenActionFilter = {
    address: params.profile.ownedBy.address
  }
  return lensClient()
    .publication.fetchAll({
      where: {
        withOpenActions: [address],
        publicationTypes: [PublicationType.Comment]
      }
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
        where: {
          from: [profile.id],
          publicationTypes: [PublicationType.Comment],
          metadata: {
            tags: { all: [PostTags.Application.Accept] }
          }
        }
      })
    ).items.filter(isCommentPublication)

    const vhrCollectData = (await getCollectedPosts({ profile })).filter(
      isCommentPublication
    )

    const opData: PostFragment[] = []

    const isValidPostFragment = (
      obj: {} | PostFragment
    ): obj is PostFragment => {
      return (
        obj &&
        '__typename' in obj &&
        (obj as PostFragment).__typename === 'Post'
      )
    }

    opData.push(
      ...apAcceptCommentsData.map((d) => d.root).filter(isValidPostFragment)
    )

    opData.push(
      ...vhrCollectData.map((d) => d.root).filter(isValidPostFragment)
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
      .filter((a) => {
        if (isValidPostFragment(a.root)) {
          return opMap.has(a.root.id)
        }
        return false
      })
      .filter((a) => {
        // Ensure that 'a.commentOn' exists and is a 'CommentPublication'
        return !!a.commentOn && isCommentPublication(a.commentOn)
      })

    const filteredColData = vhrCollectData.filter((a) => {
      if (isValidPostFragment(a.root)) {
        return opMap.has(a.root.id)
      }
      return false
    })

    const dateJoinedMap = new Map<string, string>([
      ...filteredApAcceptComments
        .map((v) => [v.commentOn?.id, v.createdAt])
        .filter((pair): pair is [string, string] => !!pair[0] && !!pair[1]),
      ...filteredColData
        .map((v) => [v.id, v.createdAt])
        .filter((pair): pair is [string, string] => !!pair[0] && !!pair[1])
    ])

    const applications = filteredApAcceptComments
      .map((a) => [a.commentOn, a.root] as [CommentFragment, PostFragment])
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
          if (isValidPostFragment(a.root)) {
            const op = opMap.get(a.root.id)
            if (!op) throw new InvalidMetadataException('Invalid metadata')
            return new LogVhrRequestMetadataBuilder(a, op).build()
          }
        } catch (e) {
          if (e instanceof InvalidMetadataException) {
            logIgnoreWarning(a, e)
          } else {
            console.error(e)
          }
        }
        return null
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
