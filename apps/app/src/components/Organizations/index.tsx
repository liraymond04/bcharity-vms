import SEO from '@components/utils/SEO'
import { SearchIcon } from '@heroicons/react/outline'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  ProfileFragment
} from '@lens-protocol/client'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { testSearch } from '@/lib'
import { useExplorePublications } from '@/lib/lens-protocol'
import { isPost, PostTags } from '@/lib/metadata'

import Error from '../Dashboard/Modals/Error'
import { GridItemFour, GridLayout } from '../GridLayout'
import Divider from '../Shared/Divider'
import { Spinner } from '../UI/Spinner'
import OrganizationCard from './OrganizationCard'

/**
 * A component that displays the browse organizations page.
 *
 * Organizations are fetched using the {@link useExplorePublications} hook filtered
 * using the metadata tags {@link PostTags.OrgPublish.Opportunity} and {@link PostTags.OrgPublish.Cause},
 * and storing all the organization profiles that posted them.
 *
 * Results from the Lens hook are mapped and displayed as a {@link OrganizationCard} in a grid.
 * The number of postings made by an organization are counted during the first fectch and sorting
 * of organization profiles, and are passed as a property to the card.
 *
 * Displayed posts are further filtered by the search inputs and category dropdown filter.
 * Search uses the {@link testSearch} function to fuzzy search posts matching the search
 * query.
 */
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
      orderBy: ExplorePublicationsOrderByType.Latest,
      where: {
        publicationTypes: [ExplorePublicationType.Post],
        metadata: {
          tags: {
            oneOf: [PostTags.OrgPublish.Opportunity, PostTags.OrgPublish.Cause]
          }
        }
        // noRandomize: true // might be deprecated, not found in the request options anymore
      }
    },
    true
  )

  useEffect(() => {
    const _profiles: Record<string, ProfileFragment> = {}
    const _postings: Record<string, number> = {}

    const filtered = opportunityOrCausePublications
      .filter(isPost)
      .filter((p) => !p.isHidden)

    filtered.forEach((p) => {
      const id = p.by.id

      if (!_profiles[id]) {
        _profiles[id] = p.by
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
          <div className="flex justify-between w-[300px] h-[50px] bg-accent-content items-center rounded-md border-violet-300 border-2 ml-10 mr-10 dark:bg-Input">
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

          {/* <div className="flex flex-wrap gap-y-5 justify-around w-[420px] items-center">
            <div className="h-[50px] z-10 ">
              <DashboardDropDown
                label={t('filters')}
                options={['Option 1', 'Option 2', 'Option 3']}
                onClick={(c) => setSelectedCategory(c)}
                selected={selectedCategory}
              ></DashboardDropDown>
            </div>
            <ClearFilters onClick={() => setSelectedCategory('')} />
          </div> */}
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
          {profiles
            .filter((profile) =>
              testSearch(
                profile.handle ? profile.handle.fullHandle : profile.id,
                searchValue
              )
            ) // not sure if this is the correct decision if handle doesn't exist
            .map((profile) => (
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
