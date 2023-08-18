import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { checkAuth, useCreateComment } from '@/lib/lens-protocol'
import useApplications from '@/lib/lens-protocol/useApplications'
import { buildMetadata, PostTags } from '@/lib/metadata'
import { useAppPersistStore } from '@/store/app'

interface IOrganizationLogVHRProps {}

const OrganizationManagement: React.FC<IOrganizationLogVHRProps> = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.log-vhr'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const { createComment } = useCreateComment()

  const { currentUser: profile } = useAppPersistStore()

  const { loading, data, error, refetch } = useApplications({ profile })

  console.log(data, error, loading)
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

  const onAcceptClick = async (publicationId: string) => {
    if (profile === null) return

    setIdPending(publicationId)

    try {
      await checkAuth(profile.ownedBy)

      const metadata = buildMetadata(profile, [PostTags.Application.Accept], {})

      await createComment({ publicationId, metadata, profileId: profile.id })
    } catch (e: any) {
      setVerifyOrRejectError(e.message ?? e)
    }

    removeIdPending(publicationId)
  }

  const onRejectClick = async (publicationId: string) => {
    if (profile === null) return

    setIdPending(publicationId)

    try {
      await checkAuth(profile.ownedBy)

      const metadata = buildMetadata(profile, [PostTags.Application.Accept], {})

      await createComment({ publicationId, metadata, profileId: profile.id })
    } catch (e: any) {
      setVerifyOrRejectError(e.message ?? e)
    }

    removeIdPending(publicationId)
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
    <div>
      {data.map((ap) => {
        return <p key={ap.post_id}>{ap.description}</p>
      })}
    </div>
  )
}

export default OrganizationManagement
