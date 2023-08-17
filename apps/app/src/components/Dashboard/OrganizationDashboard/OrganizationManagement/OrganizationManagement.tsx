import { useMemo, useState } from 'react'
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

      const metadata = buildMetadata<{}>(
        profile,
        [PostTags.Application.Accept],
        {}
      )

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

      const metadata = buildMetadata<{}>(
        profile,
        [PostTags.Application.Accept],
        {}
      )

      await createComment({ publicationId, metadata, profileId: profile.id })
    } catch (e: any) {
      setVerifyOrRejectError(e.message ?? e)
    }

    removeIdPending(publicationId)
  }

  return <div>test</div>
}

export default OrganizationManagement
