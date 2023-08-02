import SEO from '@components/utils/SEO'
import { SearchIcon } from '@heroicons/react/outline'
import {
  ProfileFragment,
  PublicationSortCriteria,
  PublicationsQueryRequest,
  PublicationTypes
} from '@lens-protocol/client'
import { NextPage } from 'next'
import { useEffect, useMemo, useState } from 'react'

import { getAttribute } from '@/lib/lens-protocol/getAttribute'
import getOpportunityMetadata from '@/lib/lens-protocol/getOpportunityMetadata'
import lensClient from '@/lib/lens-protocol/lensClient'
import useExplorePublications from '@/lib/lens-protocol/useExplorePublications'
import { PostTags } from '@/lib/types'

import DashboardDropDown from '../Dashboard/VolunteerDashboard/DashboardDropDown'
import { GridItemFour, GridLayout } from '../GridLayout'
import Divider from '../Shared/Divider'
import { Spinner } from '../UI/Spinner'
import OrganizationCard from './OrganizationCard'

const Organizations: NextPage = () => {
  const {
    data,
    error: exploreError,
    loading
  } = useExplorePublications(
    {
      sortCriteria: PublicationSortCriteria.Latest,
      metadata: {
        tags: {
          oneOf: [PostTags.OrgPublish.Opportuntiy, PostTags.OrgPublish.Cause]
        }
      },
      noRandomize: true
    },
    true
  )

  const [otherError, setOtherError] = useState(false)

  const posts = useMemo(() => getOpportunityMetadata(data), [data])

  const [profiles, setProfiles] = useState<ProfileFragment[]>([])
  const [postings, setPostings] = useState<number[]>([])

  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

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
      .then((result) => {
        const opportunity_ids = new Set<string>()
        const cause_ids = new Set<string>()

        result.items.filter((res) => {
          if (!res.hidden && res.__typename === 'Post') {
            const opp_id = getAttribute(
              res.metadata.attributes,
              'opportunity_id'
            )
            const cause_id = getAttribute(res.metadata.attributes, 'cause_id')
            if (opp_id !== '') opportunity_ids.add(opp_id)
            if (cause_id !== '') cause_ids.add(cause_id)
          }
        })

        return opportunity_ids.size + cause_ids.size
      })
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
      <div className="mx-auto max-w-screen-xl px-0 sm:px-5">
        <div className="flex flex-wrap gap-y-5 justify-around items-center mt-10">
          <div className="flex justify-between w-[300px] h-[50px] bg-white items-center rounded-md border-violet-300 border-2 ml-10 mr-10 dark:bg-black">
            <input
              className="focus:ring-0 border-none outline-none focus:border-none focus:outline-none  bg-transparent rounded-2xl w-[250px]"
              type="text"
              value={searchValue}
              placeholder="Search"
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
            <div className="h-5 w-5 mr-5">
              <SearchIcon />
            </div>
          </div>

          <div className="flex flex-wrap gap-y-5 justify-around w-[420px] items-center">
            <div className="h-[50px] z-10 ">
              <DashboardDropDown
                label="Filter:"
                options={['Option 1', 'Option 2', 'Option 3']}
                onClick={(c) => setSelectedCategory(c)}
                selected={selectedCategory}
              ></DashboardDropDown>
            </div>
            <button
              className="ml-3 min-w-[110px] h-fit text-red-500 bg-[#ffc2d4] border-red-500 border-2 rounded-md px-2 hover:bg-red-500 hover:text-white hover:cursor-pointer"
              onClick={() => {
                setSelectedCategory('')
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
        <Divider className="mt-5" />
        <p className="font-bold text-2xl">Browse Organizations</p>
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
