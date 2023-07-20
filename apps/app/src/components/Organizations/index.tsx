import SEO from '@components/utils/SEO'
import {
  ProfileFragment,
  PublicationSortCriteria,
  PublicationsQueryRequest,
  PublicationTypes
} from '@lens-protocol/client'
import { NextPage } from 'next'
import { useEffect, useMemo, useState } from 'react'

import getOpportunityMetadata from '@/lib/lens-protocol/getOpportunityMetadata'
import lensClient from '@/lib/lens-protocol/lensClient'
import useExplorePublications from '@/lib/lens-protocol/useExplorePublications'
import { PostTags } from '@/lib/types'

import { GridItemFour, GridLayout } from '../GridLayout'
import Divider from '../Shared/Divider'
import FilterDropdown from '../Shared/FilterDropdown'
import Search from '../Shared/Search'
import { Spinner } from '../UI/Spinner'
import OrganizationCard from './OrganizationCard'

const Organizations: NextPage = () => {
  const {
    data,
    error: exploreError,
    loading
  } = useExplorePublications({
    sortCriteria: PublicationSortCriteria.Latest,
    metadata: {
      tags: {
        oneOf: [PostTags.OrgPublish.Opportuntiy, PostTags.OrgPublish.Cause]
      }
    }
  })

  const [otherError, setOtherError] = useState(false)

  const posts = useMemo(() => getOpportunityMetadata(data), [data])

  const [profiles, setProfiles] = useState<ProfileFragment[]>([])
  const [postings, setPostings] = useState<number[]>([])

  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const uniqueIds: Set<string> = new Set()

    posts.forEach((post) => uniqueIds.add(post.from.id))

    if (uniqueIds.size > 0)
      lensClient()
        .profile.fetchAll({ profileIds: Array.from(uniqueIds) })
        .then((res) => setProfiles(res.items))
        .catch((err) => {
          console.log(err)
          setOtherError(true)
        })
  }, [posts])

  const generateRequest = (profileId: string) => {
    const param: PublicationsQueryRequest = {
      profileId,
      publicationTypes: [PublicationTypes.Post],
      metadata: {
        tags: {
          oneOf: [PostTags.OrgPublish.Cause, PostTags.OrgPublish.Opportuntiy]
        }
      }
    }

    return lensClient()
      .publication.fetchAll(param)
      .then((result) => result.items.filter((res) => !res.hidden).length)
  }

  useEffect(() => {
    Promise.all(profiles.map((profile) => generateRequest(profile.id)))
      .then((lengths) => setPostings(lengths))
      .catch((err) => {
        setOtherError(true)
        console.log(err)
      })
  }, [profiles])

  return (
    <>
      <SEO title="Organizations • BCharity VMS" />
      <div className="mx-auto max-w-screen-xl px-0 sm:px-5 font-bold text-2xl">
        <div className="flex justify-between py-5">
          <Search searchText={searchValue} setSearchText={setSearchValue} />
          <FilterDropdown
            label="Filter:"
            onChange={(c) => console.log('filter', c)}
            options={['Option 1', 'Option 2', 'Option 3']}
          />
        </div>
        <Divider />
        <p>Browse Organizations</p>
      </div>
      {loading ? (
        <div className="flex justify-center p-5">
          <Spinner />
        </div>
      ) : (
        <GridLayout>
          {profiles.map((profile, index) => (
            <GridItemFour key={profile.id}>
              <OrganizationCard profile={profile} postings={postings[index]} />
            </GridItemFour>
          ))}
        </GridLayout>
      )}
      {(exploreError || otherError) && (
        <div className="text-sm text-red-700 dark:text-red-200">
          Something went wrong
        </div>
      )}
    </>
  )
}

export default Organizations
