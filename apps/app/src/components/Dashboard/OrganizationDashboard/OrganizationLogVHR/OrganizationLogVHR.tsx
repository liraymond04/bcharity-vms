import { SearchIcon } from '@heroicons/react/outline'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import GridRefreshButton from '@/components/Shared/GridRefreshButton'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import {
  checkAuth,
  createCollect,
  useCreateComment,
  useVHRRequests
} from '@/lib/lens-protocol'
import { buildMetadata, PostTags } from '@/lib/metadata'
import testSearch from '@/lib/search'
import { useAppPersistStore } from '@/store/app'

import Error from '../../Modals/Error'
import DashboardDropDown from '../../VolunteerDashboard/DashboardDropDown'
import VHRDetailCard from './VHRDetailCard'
import VHRVerifyCard from './VHRVerifyCard'

/**
 * Component that displays a page to manage volunteer VHR requests. Requests are fetched
 * using the {@link useVHRRequests} hook.
 *
 * @remarks
 * Requests are accepted by using Lens to collect the publication, and rejected by adding
 * a comment under the post using the {@link useCreateComment} hook and the {@link PostTags.VhrRequest.Reject}
 * metadata tag.
 *
 * Displayed posts are further filtered by the search inputs and category dropdown filter.
 * Search uses the {@link testSearch} function to fuzzy search posts matching the search
 * query. The category dropdown filter displays posts only with the selected category in
 * their metadata, and its dropdown is displayed with the {@link DashboardDropDown} component.
 *
 * Selected VHR requests are displayed using the {@link VHRDetailCard}, and the items in
 * the list of VHR requests is displayed using the {@link VHRVerifyCard}.
 */
const OrganizationLogVHRTab: React.FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.log-vhr'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const { createComment } = useCreateComment()

  const { currentUser: profile } = useAppPersistStore()

  const { loading, data, error, refetch } = useVHRRequests({ profile })

  const [selectedId, setSelectedId] = useState('')
  const [pendingIds, setPendingIds] = useState<Record<string, boolean>>({})

  const selectedValue = useMemo(() => {
    return data.find((val) => val.post_id === selectedId) ?? null
  }, [data, selectedId])

  const [verifyOrRejectError, setVerifyOrRejectError] = useState('')

  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const [searchValue, setSearchValue] = useState<string>('')

  const setIdPending = (id: string) => {
    const newPendingIds = { ...pendingIds, [id]: true }
    setPendingIds(newPendingIds)
  }

  const removeIdPending = (id: string) => {
    setPendingIds({ ...pendingIds, [id]: false })
  }

  const onAcceptClick = async (id: string) => {
    if (profile === null) return

    setIdPending(id)

    try {
      await checkAuth(profile.ownedBy.address, profile.id)
      await createCollect(id)
    } catch (e: any) {
      setVerifyOrRejectError(e?.message ?? e)
    }

    removeIdPending(id)
  }

  const onRejectClick = async (id: string) => {
    if (profile === null) return

    setIdPending(id)

    try {
      await checkAuth(profile.ownedBy.address, profile.id)

      const metadata = buildMetadata(profile, [PostTags.VhrRequest.Reject], {})

      await createComment({
        profileId: profile.id,
        publicationId: id,
        metadata
      })
    } catch (e: any) {
      setVerifyOrRejectError(e.message ?? e)
    }

    removeIdPending(id)
  }

  const shouldShowError = () => {
    return (
      (verifyOrRejectError &&
        !verifyOrRejectError.startsWith('UserRejectedRequestError') &&
        !verifyOrRejectError.startsWith('User rejected the request')) ||
      error
    )
  }

  const getErrorMessage = () => {
    if (error) {
      return error
    } else if (
      verifyOrRejectError &&
      !verifyOrRejectError.startsWith('UserRejectedRequestError') &&
      !verifyOrRejectError.startsWith('User rejected the request')
    ) {
      return verifyOrRejectError
    }
  }

  useEffect(() => {
    let result = new Set<string>()
    data.map((value) => result.add(value.opportunity.category))
    setCategories(Array.from(result))
  }, [data])

  return (
    <div className="mx-4 my-8 flex flex-col max-h-screen">
      <div className="flex flex-wrap gap-y-5 justify-around items-center mt-10">
        <div className="flex justify-between w-[300px] h-[50px] bg-white items-center rounded-md border-violet-300 dark:border-indigo-900 border-2 ml-10 mr-10 dark:bg-Input">
          <input
            suppressHydrationWarning
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
              label={t('filter')}
              options={Array.from(categories)}
              onClick={(c) => {
                if (c == selectedCategory) setSelectedCategory('')
                else setSelectedCategory(c)
              }}
              selected={selectedCategory}
            />
          </div>
        </div>
      </div>

      <Card className="px-4 py-3 mt-10">
        <div className="flex flex-col">
          <GridRefreshButton onClick={refetch} className="ml-auto mb-1" />
          {!loading ? (
            <>
              <div className="flex flex-col min-h-96 overflow-auto">
                {data
                  .filter((value) => {
                    return (
                      (selectedCategory == '' ||
                        selectedCategory == value.opportunity.category) &&
                      testSearch(
                        value.opportunity.category +
                          ' ' +
                          value.opportunity.startDate +
                          ' ' +
                          value.opportunity.endDate +
                          ' ' +
                          value.from.handle +
                          ' ' +
                          value.opportunity.name,
                        searchValue
                      )
                    )
                  })
                  .map((value) => {
                    const selected = value.post_id === selectedId

                    return (
                      <VHRVerifyCard
                        pending={!!pendingIds[value.post_id]}
                        selected={selected}
                        key={value.post_id}
                        value={value}
                        onClick={() =>
                          setSelectedId(selected ? '' : value.post_id)
                        }
                        onAcceptClick={() => onAcceptClick(value.post_id)}
                        onRejectClick={() => onRejectClick(value.post_id)}
                      />
                    )
                  })}
              </div>
              {selectedValue && <VHRDetailCard value={selectedValue} />}
            </>
          ) : (
            <Spinner />
          )}
          {shouldShowError() && (
            <Error
              message={`${e('generic-front')}${getErrorMessage()}${e(
                'generic-back'
              )}`}
            ></Error>
          )}
        </div>
      </Card>
    </div>
  )
}

export default OrganizationLogVHRTab
