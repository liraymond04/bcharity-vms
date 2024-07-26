import SEO from '@components/utils/SEO'
import { SearchIcon } from '@heroicons/react/outline'
import {
  ExplorePublicationsOrderByType,
  ExplorePublicationType,
  ProfileFragment
} from '@lens-protocol/client'
import JSSoup from 'jssoup'
import { NextPage } from 'next'
import { SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CORS_PROXY, VHR_TOP_HOLDERS_URL } from '@/constants'
import { testSearch } from '@/lib'
import isVerified from '@/lib/isVerified'
import {
  getAvatar,
  getProfilesOwnedBy,
  useExplorePublications
} from '@/lib/lens-protocol'
import { isPost, PostTags } from '@/lib/metadata'

import Error from '../Dashboard/Modals/Error'
import { GridItemFour, GridLayout } from '../GridLayout'
import Divider from '../Shared/Divider'
import { Spinner } from '../UI/Spinner'
import OrganizationCardRevised from './OrganizationCardRevised'

export interface Item {
  index: number
  address: string
  handle: string
  amount: number
  percentage: string
  avatar: string
}

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

  const [organizationData, setOrganizationData] = useState<Item[]>()
  const [organizationsIsLoading, setOrganizationsIsLoading] =
    useState<boolean>(false)

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

  const sortItems = async (
    items: Item[],
    setData: (value: SetStateAction<Item[] | undefined>) => void,
    setIsLoading: (value: SetStateAction<boolean>) => void,
    verified: boolean
  ) => {
    let arr: Item[] = []
    for (let i = 0; i < items.length; i++) {
      let item: Item = Object.create(items[i])
      let profiles = await getProfilesOwnedBy(item.address)
      profiles = profiles.filter(
        (profile) => isVerified(profile.id) === verified
      )
      item.handle = profiles[0]?.handle?.localName || ''
      if (profiles.length > 0) {
        item.avatar = getAvatar(profiles[0])
        arr.push(item)
        setData(arr)
      }
    }
    setIsLoading(false)
  }

  const getHolders = async () => {
    setOrganizationsIsLoading(true)
    try {
      const url = CORS_PROXY + encodeURIComponent(VHR_TOP_HOLDERS_URL)
      const response = await fetch(url)
      const html = await response.text()

      // scraping
      const soup = new JSSoup(html)
      const tag = soup.findAll('td')
      const fullAddressTag = soup.findAll('span')
      let index = 0
      let items: Item[] = []
      let cur = []
      for (let i = 0; i < tag.length; i++) {
        cur[i % 4] = tag[i].text
        if (i % 4 === 0 && i !== 0) {
          items[index] = {
            index: index,
            address: cur[1],
            handle: '',
            amount: Number(cur[2]?.replace(/,/g, '')),
            percentage: cur[3],
            avatar: ''
          }
          index++
        }
      }

      // change address to non-abbreviated version
      let i = 0
      index-- // if there are 30 items, index should be 29
      let index2 = 0
      while (i < fullAddressTag.length && index2 <= index) {
        // console.log(index2 + ": " + items[index2].address)
        if (fullAddressTag[i].attrs['data-highlight-target'] != undefined) {
          items[index2].address =
            fullAddressTag[i].attrs['data-highlight-target']
          index2++
          // console.log(index2 - 1 + " Has been changed to: " + items[index2 - 1].address)
        }
        i++
      }

      sortItems(items, setOrganizationData, setOrganizationsIsLoading, true)
    } catch (e) {
      if (e instanceof Error) {
        console.log(e)
      }
      setOrganizationsIsLoading(false)
    }
  }

  useEffect(() => {
    getHolders()
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
        <div className="mt-5">
          <p className="font-bold text-2xl" suppressHydrationWarning>
            {t('title')}
            <Divider className="mt-5" />
          </p>
        </div>
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
        Results for: {searchValue}
      </div>
      {loading ? (
        <div className="flex justify-center p-5">
          <Spinner />
        </div>
      ) : (
        <GridLayout>
          {organizationData
            ?.filter(
              (
                profile // data pulled from VHR holder list. if a different list is used
                // then the old code/current code can be adapted for said list.
              ) =>
                testSearch(
                  profile.handle ? profile.handle : profile.address,
                  searchValue
                )
            ) // not sure if this is the correct decision if handle doesn't exist
            .map((profile) => (
              <GridItemFour key={profile.address}>
                <OrganizationCardRevised data={profile} />
              </GridItemFour>
            ))
          /* 
              old code for documentation
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
              */
          }
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
