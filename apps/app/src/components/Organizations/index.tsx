import SEO from '@components/utils/SEO'
import { SearchIcon } from '@heroicons/react/outline'
import {
  ProfileFragment,
  PublicationSortCriteria,
  PublicationTypes
} from '@lens-protocol/client'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useExplorePublications } from '@/lib/lens-protocol'
import { isPost, PostTags } from '@/lib/metadata'

import Error from '../Dashboard/Modals/Error'
import DashboardDropDown from '../Dashboard/VolunteerDashboard/DashboardDropDown'
import { GridItemFour, GridLayout } from '../GridLayout'
import ClearFilters from '../Shared/ClearFilters'
import Divider from '../Shared/Divider'
import { Spinner } from '../UI/Spinner'
import OrganizationCard from './OrganizationCard'

const Organizations: NextPage = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.organizations'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [profiles, setProfiles] = useState<ProfileFragment[]>([])
  const [postings, setPostings] = useState<Record<string, number>>({})

  const {
    data: opportunityOrCausePublications,
    error: exploreError,
    loading
  } = useExplorePublications(
    {
      sortCriteria: PublicationSortCriteria.Latest,
      publicationTypes: [PublicationTypes.Post],
      metadata: {
        tags: {
          oneOf: [PostTags.OrgPublish.Opportunity, PostTags.OrgPublish.Cause]
        }
      },
      noRandomize: true
    },
    true
  )

  useEffect(() => {
    const _profiles: Record<string, ProfileFragment> = {}
    const _postings: Record<string, number> = {}

    const filtered = opportunityOrCausePublications
      .filter(isPost)
      .filter((p) => !p.hidden)

    filtered.forEach((p) => {
      const id = p.profile.id

      if (!_profiles[id]) {
        _profiles[id] = p.profile
      }

      if (_postings[id] === undefined) {
        _postings[id] = 0
      }

      _postings[id] = _postings[id] + 1
    })

    setProfiles(Object.values(_profiles))
    setPostings(_postings)
  }, [opportunityOrCausePublications])

  return (
    <>
      <SEO title="Organizations • BCharity VMS" />
      <div className="mx-auto max-w-screen-xl px-0 sm:px-5">
        <div className="flex flex-wrap gap-y-5 justify-around items-center mt-10">
          <div className="flex justify-between w-[300px] h-[50px] bg-white items-center rounded-md border-violet-300 border-2 ml-10 mr-10 dark:bg-Input">
            <input
              className="focus:ring-0 border-none outline-none focus:border-none focus:outline-none  bg-transparent rounded-2xl w-[250px]"
              type="text"
              value={searchValue}
              placeholder={t('search')}
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
                label={t('filters')}
                options={['Option 1', 'Option 2', 'Option 3']}
                onClick={(c) => setSelectedCategory(c)}
                selected={selectedCategory}
              ></DashboardDropDown>
            </div>
            <ClearFilters onClick={() => setSelectedCategory('')} />
          </div>
        </div>
        <Divider className="mt-5" />
        <p className="font-bold text-2xl" suppressHydrationWarning>
          {t('title')}
        </p>
      </div>
      {loading ? (
        <div className="flex justify-center p-5">
          <Spinner />
        </div>
      ) : (
        <GridLayout>
          {profiles.map((profile) => (
            <GridItemFour key={profile.id}>
              <OrganizationCard
                profile={profile}
                postings={postings[profile.id]}
              />
            </GridItemFour>
          ))}
        </GridLayout>
      )}
      {exploreError && (
        <Error
          message={`${e('generic-front')}${exploreError}${e('generic-back')}`}
        />
      )}
    </>
  )
}

export default Organizations
