import { useMemo, useState } from 'react'

import { Card, ErrorMessage, Spinner } from '@/components/UI'
import { checkAuth, useCreateComment } from '@/lib/lens-protocol'
import useApplications from '@/lib/lens-protocol/useApplications'
import { buildMetadata, PostTags } from '@/lib/metadata'
import { useAppPersistStore } from '@/store/app'

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

  return (
    <div className={`${hidden ? 'hidden' : ''} flex space-x-24 pt-5`}>
      <Card className={`h-1/2 w-1/2`}>
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
  )
}

export default VolunteerApplicationsTab
