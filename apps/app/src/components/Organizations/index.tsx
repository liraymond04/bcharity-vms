import SEO from '@components/utils/SEO'
import { LocationMarkerIcon } from '@heroicons/react/outline'
import { DotsHorizontalIcon, StarIcon } from '@heroicons/react/solid'
import { ProfileFragment, PublicationSortCriteria } from '@lens-protocol/client'
import { NextPage } from 'next'
import { useEffect, useMemo, useState } from 'react'

import getAvatar from '@/lib/getAvatar'
import getOpportunityMetadata from '@/lib/lens-protocol/getOpportunityMetadata'
import lensClient from '@/lib/lens-protocol/lensClient'
import useExplorePublications from '@/lib/lens-protocol/useExplorePublications'
import { PostTags } from '@/lib/types'

import { GridItemFour, GridLayout } from '../GridLayout'
import Divider from '../Shared/Divider'
import GradientWrapper from '../Shared/Gradient/GradientWrapper'
import Search from '../Shared/Search'
import FilterDropdown from '../Shared/SearchDropdown'
import { Card } from '../UI/Card'
import { Spinner } from '../UI/Spinner'

const Organizations: NextPage = () => {
  const { data, error, loading } = useExplorePublications({
    sortCriteria: PublicationSortCriteria.Latest,
    metadata: {
      tags: {
        oneOf: [PostTags.OrgPublish.Opportuntiy, PostTags.OrgPublish.Cause]
      }
    }
  })

  const posts = useMemo(() => getOpportunityMetadata(data), [data])

  const [profiles, setProfiles] = useState<ProfileFragment[]>([])

  useEffect(() => {
    const uniqueIds: Set<string> = new Set()

    posts.forEach((post) => uniqueIds.add(post.from.id))

    if (uniqueIds.size > 0)
      lensClient()
        .profile.fetchAll({ profileIds: Array.from(uniqueIds) })
        .then((res) => {
          setProfiles(res.items)
          console.log(res)
        })
        .catch((err) => console.log(err))
  }, [posts])

  return (
    <>
      <SEO title="Organizations • BCharity VMS" />
      <GradientWrapper>
        <div className="mx-auto max-w-screen-xl px-0 sm:px-5 font-bold text-2xl">
          <div className="flex justify-between py-5">
            <Search />
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
            {profiles.map((profile) => (
              <GridItemFour key={profile.id}>
                <Card>
                  <div className="flex m-1 mr-2">
                    <img
                      className="w-[100px] h-[100px] rounded-md mr-3"
                      src={getAvatar(profile)}
                      alt={`${profile.handle}'s profile picture`}
                    />
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between">
                        <p>{profile.handle}</p>
                        <DotsHorizontalIcon className="w-4 text-zinc-400" />
                      </div>
                      <p>{5} postings</p>
                      <div className="flex justify-between grow">
                        <div>
                          <LocationMarkerIcon className="w-4 inline" />
                          <p className="inline">LOCATION</p>
                        </div>
                        <div className="bg-brand-300 p-1 rounded-md place-self-end">
                          <StarIcon className="w-4 align-end text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </GridItemFour>
            ))}
          </GridLayout>
        )}
        {error && (
          <div className="text-sm text-red-700 dark:text-red-200">
            Something went wrong
          </div>
        )}
      </GradientWrapper>
    </>
  )
}

export default Organizations
