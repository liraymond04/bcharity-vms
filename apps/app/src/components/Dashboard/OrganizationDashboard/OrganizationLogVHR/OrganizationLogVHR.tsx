import { SearchIcon } from '@heroicons/react/outline'
import {
  PublicationMainFocus,
  PublicationMetadataV2Input
} from '@lens-protocol/client'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 } from 'uuid'

import GridRefreshButton from '@/components/Shared/GridRefreshButton'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import { APP_NAME } from '@/constants'
import getUserLocale from '@/lib/getUserLocale'
import {
  checkAuth,
  createCollect,
  useCreateComment,
  useVHRRequests
} from '@/lib/lens-protocol'
import { PostTags } from '@/lib/metadata'
import testSearch from '@/lib/search'
import { useAppPersistStore } from '@/store/app'

import Error from '../../Modals/Error'
import DashboardDropDown from '../../VolunteerDashboard/DashboardDropDown'
import VHRDetailCard from './VHRDetailCard'
import VHRVerifyCard from './VHRVerifyCard'

interface IOrganizationLogVHRProps {}

const OrganizationLogVHRTab: React.FC<IOrganizationLogVHRProps> = () => {
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
      await checkAuth(profile.ownedBy)
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
      await checkAuth(profile.ownedBy)
      const metadata: PublicationMetadataV2Input = {
        version: '2.0.0',
        metadata_id: v4(),
        content: `#${PostTags.VhrRequest.Reject}`,
        locale: getUserLocale(),
        tags: [PostTags.VhrRequest.Reject],
        mainContentFocus: PublicationMainFocus.TextOnly,
        name: `${PostTags.VhrRequest.Reject} by ${profile?.handle}`,
        attributes: [],
        appId: APP_NAME
      }

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
