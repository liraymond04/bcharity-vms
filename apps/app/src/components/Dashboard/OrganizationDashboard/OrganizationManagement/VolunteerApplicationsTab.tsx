import { SearchIcon } from '@heroicons/react/outline'
import { useMemo, useState } from 'react'

import { ClearFilters } from '@/components/Shared'
import { Card, ErrorMessage, Spinner } from '@/components/UI'
import { checkAuth, useCreateComment } from '@/lib/lens-protocol'
import useApplications from '@/lib/lens-protocol/useApplications'
import { buildMetadata, PostTags } from '@/lib/metadata'
import { useAppPersistStore } from '@/store/app'

import { DashboardDropDown } from '../../VolunteerDashboard'
import PurpleBox from './PurpleBox'
import VolunteerApplicationCard from './VolunteerApplicationCard'

interface IVolunteerApplicationsTabProps {
  hidden: boolean
}

const VolunteerApplicationsTab: React.FC<IVolunteerApplicationsTabProps> = ({
  hidden
}) => {
  const { currentUser: profile } = useAppPersistStore()
  const { createComment } = useCreateComment()

  const { loading, data, error, refetch } = useApplications({ profile })

  const [selectedId, setSelectedId] = useState<string>('')

  const selectedValue = useMemo(() => {
    return data.find((val) => val.post_id === selectedId) ?? null
  }, [data, selectedId])

  const [pendingIds, setPendingIds] = useState<Record<string, boolean>>({})
  const [verifyOrRejectError, setVerifyOrRejectError] = useState('')

  const [searchValue, setSearchValue] = useState('')
  const [categories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const setIdPending = (id: string) => {
    const newPendingIds = { ...pendingIds, [id]: true }
    setPendingIds(newPendingIds)
  }

  const removeIdPending = (id: string) => {
    setPendingIds({ ...pendingIds, [id]: false })
  }

  const onAcceptClick = async () => {
    if (profile === null) return

    setIdPending(selectedId)

    try {
      await checkAuth(profile.ownedBy)

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

  const onRejectClick = async () => {
    if (profile === null) return

    setIdPending(selectedId)

    try {
      await checkAuth(profile.ownedBy)

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
    <div className={`${hidden ? 'hidden' : ''} flex space-x-24 pt-5`}>
      <div className="grow w-0">
        <h1 className="text-3xl font-bold pb-3">Volunteer Applications</h1>
        <div className="flex items-center">
          <div className="flex justify-between h-[50px] bg-accent-content items-center rounded-md border-violet-300 border-2 dark:bg-Input">
            <input
              className="focus:ring-0 border-none outline-none focus:border-none focus:outline-none bg-transparent rounded-2xl"
              type="text"
              value={searchValue}
              placeholder={'search'}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
            <div className="h-5 w-5 mr-5">
              <SearchIcon />
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-[50px] z-10 ">
              <DashboardDropDown
                label={'filter'}
                options={Array.from(categories)}
                onClick={(c) => setSelectedCategory(c)}
                selected={selectedCategory}
              ></DashboardDropDown>
            </div>
            <ClearFilters
              onClick={() => {
                setSelectedCategory('')
              }}
            />
          </div>
        </div>

        <Card>
          {(verifyOrRejectError || error) && (
            <ErrorMessage error={new Error(verifyOrRejectError || error)} />
          )}
          <div className="scrollbar">
            {loading ? (
              <Spinner />
            ) : (
              <>
                {data.map((item) => {
                  return (
                    <PurpleBox
                      key={item.post_id}
                      selected={selectedId === item.post_id}
                      userName={item.from.name ?? item.from.handle}
                      dateCreated={item.createdAt}
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
      </div>
      <div className="grow w-0">
        {selectedId !== '' && !!selectedValue && (
          <div className="pb-10">
            <VolunteerApplicationCard
              application={selectedValue}
              onAccept={() => onAcceptClick()}
              onReject={() => onRejectClick()}
              pending={pendingIds[selectedId]}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default VolunteerApplicationsTab
