import { SearchIcon } from '@heroicons/react/outline'
import {
  forwardRef,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'

import { GridItemSix, GridLayout } from '@/components/GridLayout'
import { ClearFilters } from '@/components/Shared'
import { Card, ErrorMessage, Spinner } from '@/components/UI'
import { testSearch } from '@/lib'
import { checkAuth, lensClient, useCreateComment } from '@/lib/lens-protocol'
import useApplications from '@/lib/lens-protocol/useApplications'
import { buildMetadata, PostTags } from '@/lib/metadata'
import { useAppPersistStore } from '@/store/app'

import PurpleBox from '../OrganizationDashboard/OrganizationManagement/PurpleBox'
import { DashboardDropDown } from '../VolunteerDashboard'
import YourApplications from './YourApplicationCard'

/**
 * Reference to the {@link VolunteerApplicationsTab} component;
 */
export interface ApplicationsRef {
  /**
   * Function to refetch applications
   * @returns
   */
  refetch: () => void
}

/**
 * Properties of {@link VolunteerApplicationsTab}
 */
export interface IVolunteerApplicationsTabProps {
  /**
   * Whether the component should be shown
   */
  hidden: boolean
}
/**
 * Component that displays the volunteer log hours tab page, which displays the
 * opportunity posts that a user has bookmarked
 *
 * Bookmarked posts are fetched using the {@link usePostData} hook, and the
 * metadata post tags {@link PostTags.Bookmark.Opportunity}, which are filtered
 * using the {@link DashboardDropDown}.
 *
 * The table results are refreshed manually using the {@link GridRefreshButton}
 */
const VolunteerApplications = forwardRef<
  ApplicationsRef | null,
  IVolunteerApplicationsTabProps
>(({ hidden }, ref) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.management.applications'
  })
  const { currentUser: profile } = useAppPersistStore()
  const { createComment } = useCreateComment()

  const { loading, data, error, refetch } = useApplications({ profile })

  useImperativeHandle(ref, () => ({
    refetch
  }))

  const [selectedId, setSelectedId] = useState<string>('')

  const selectedValue = useMemo(() => {
    return data.find((val) => val.post_id === selectedId) ?? null
  }, [data, selectedId])

  const [pendingIds, setPendingIds] = useState<Record<string, boolean>>({})
  const [verifyOrRejectError, setVerifyOrRejectError] = useState('')

  const [searchValue, setSearchValue] = useState('')
  const [categories, setCategories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  // cache profile handle fetch results
  const [profileId, setProfileId] = useState<Map<string, string>>(new Map())

  // get profile handles (mostly for manual applications, since they give profile IDs)
  useEffect(() => {
    const fetch = async () => {
      const profiles = new Set<string>()
      const profileIds = new Map<string, string>()
      data.forEach(async (p) => {
        let profile = p.from.handle
        if (p.manual) {
          try {
            const result = await lensClient().profile.fetch({
              forProfileId: p.description
            })
            if (!result) throw Error()
            profile = result.handle
            profileIds.set(
              p.description,
              profile ? profile.fullHandle : 'No handle for this profile'
            )
            setProfileId(profileIds)
          } catch (error) {
            if (error instanceof Error) {
            }
          }
        }
        profiles.add(
          profile ? profile.fullHandle : 'No handle for this profile'
        )
      })
      setCategories(profiles)
    }
    fetch()
  }, [data])

  const setIdPending = (id: string) => {
    const newPendingIds = { ...pendingIds, [id]: true }
    setPendingIds(newPendingIds)
  }

  const removeIdPending = (id: string) => {
    setPendingIds({ ...pendingIds, [id]: false })
  }

  /*
  const onAcceptClick = async () => {
    if (profile === null) return

    setIdPending(selectedId)

    try {
      await checkAuth(profile.ownedBy.address)

      const metadata = buildMetadata(profile, [PostTags.Application.Accept], {})

      await createComment({
        publicationId: selectedId,
        metadata,
        profileId: profile.id
      })
    } catch (e: any) {
      setVerifyOrRejectError(e.message ?? e)
    }

    removeIdPending(selectedId)
  }
  */

  const onRejectClick = async () => {
    if (profile === null) return

    setIdPending(selectedId)

    try {
      await checkAuth(profile.ownedBy.address, profile.id)

      const metadata = buildMetadata(profile, [PostTags.Application.REJECT], {})

      await createComment({
        publicationId: selectedId,
        metadata,
        profileId: profile.id
      })
    } catch (e: any) {
      setVerifyOrRejectError(e.message ?? e)
    }

    removeIdPending(selectedId)
  }

  return (
    <div className={`${hidden ? 'hidden' : ''} pt-5`}>
      <h1 className="ml-7 text-3xl font-bold pb-3" suppressHydrationWarning>
        {t('title')}
      </h1>
      <div className="ml-7 flex flex-wrap items-center">
        <div className="flex justify-between h-[50px] bg-accent-content items-center rounded-md border-violet-300 border-2 dark:bg-Input">
          <input
            suppressHydrationWarning
            className="focus:ring-0 border-none outline-none focus:border-none focus:outline-none bg-transparent rounded-2xl"
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

        <div className="flex flex-wrap items-center py-2">
          <div className="h-[50px] z-10 ">
            <DashboardDropDown
              label={t('filter')}
              options={Array.from(categories)}
              onClick={(c: SetStateAction<string>) => setSelectedCategory(c)}
              selected={selectedCategory}
            ></DashboardDropDown>
          </div>
          <div className="py-2">
            <ClearFilters
              onClick={() => {
                setSelectedCategory('')
              }}
            />
          </div>
        </div>
      </div>
      <GridLayout>
        <GridItemSix>
          <Card className="mb-2">
            {(verifyOrRejectError || error) && (
              <ErrorMessage error={new Error(verifyOrRejectError || error)} />
            )}
            <div className="scrollbar">
              {loading ? (
                <Spinner />
              ) : (
                <>
                  {data
                    .filter((item) => {
                      let profile = item.from.handle?.fullHandle
                      let exists = profileId.get(item.description)
                      if (item.manual && exists) profile = exists
                      let result = true
                      if (searchValue !== '')
                        result = testSearch(
                          profile ? profile : item.from.id,
                          searchValue
                        )
                      if (selectedCategory === '') return result
                      return result && profile === selectedCategory
                    })
                    .map((item) => {
                      return (
                        <PurpleBox
                          key={item.post_id}
                          selected={selectedId === item.post_id}
                          userName={item.from.id ?? item.from.handle}
                          dateCreated={item.createdAt}
                          tab="applications"
                          onClick={() => {
                            setSelectedId(
                              selectedId === item.post_id ? '' : item.post_id
                            )
                          }}
                        />
                      )
                    })}
                </>
              )}

              {/* the box placeholder for the data ^ */}
            </div>
          </Card>
        </GridItemSix>
        <GridItemSix>
          {selectedId !== '' && !!selectedValue && (
            <div className="pb-10">
              <YourApplications
                application={selectedValue}
                onCancel={() => onRejectClick()}
                pending={pendingIds[selectedId]}
              />
            </div>
          )}
        </GridItemSix>
      </GridLayout>
    </div>
  )
})

VolunteerApplications.displayName = 'VolunteerApplications'

export default VolunteerApplications
