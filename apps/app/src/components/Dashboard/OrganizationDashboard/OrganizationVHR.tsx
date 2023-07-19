import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { PlusSmIcon } from '@heroicons/react/solid'
import { AgGridReact } from 'ag-grid-react'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import getOpportunityMetadata from '@/lib/lens-protocol/getOpportunityMetadata'
import usePostData from '@/lib/lens-protocol/usePostData'
import { PostTags } from '@/lib/types'
import { useAppPersistStore } from '@/store/app'

import Error from '../Modals/Error'
import ModifyOpportunityModal from '../Modals/ModifyOpportunityModal'
import PublishOpportunityModal, {
  emptyPublishFormData,
  IPublishOpportunityFormProps
} from '../Modals/PublishOpportunityModal'
import { defaultColumnDef, makeOrgVHRColumnDefs } from './ColumnDefs'

const OrganizationVHRTab: React.FC = () => {
  const { currentUser: profile } = useAppPersistStore()
  const { resolvedTheme } = useTheme()
  const [gridTheme, setGridTheme] = useState<string>()

  const { data, error, loading, refetch } = usePostData({
    profileId: profile?.id,
    metadata: {
      tags: { all: [PostTags.OrgPublish.Opportuntiy] }
    }
  })

  const postMetadata = getOpportunityMetadata(data)

  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [modifyModalOpen, setModifyModalOpen] = useState(false)

  const [currentModifyId, setCurrentModifyId] = useState('')

  const onPublishClose = (shouldRefetch: boolean) => {
    setPublishModalOpen(false)

    if (shouldRefetch) {
      refetch()
    }
  }

  const onModifyClose = (shouldRefetch: boolean) => {
    setModifyModalOpen(false)

    if (shouldRefetch) {
      refetch()
    }
  }

  const onNew = () => {
    setPublishModalOpen(true)
  }

  const onEdit = (id: string) => {
    setCurrentModifyId(id)
    setModifyModalOpen(true)
  }

  const onDelete = (id: string) => {
    console.log('delete id ', id)
  }

  useEffect(() => {
    setGridTheme(
      resolvedTheme === 'light' ? 'ag-theme-alpine' : 'ag-theme-alpine-dark'
    )
  }, [resolvedTheme])

  const getFormDefaults = (): IPublishOpportunityFormProps => {
    const d = postMetadata.find(
      (val) => val?.opportunity_id === currentModifyId
    )

    return d
      ? {
          opportunityName: d.name ?? '',
          dates: d.date ?? '',
          numHours: d.hours ?? '',
          category: d.category ?? '',
          website: d.website ?? '',
          description: d.description ?? ''
        }
      : { ...emptyPublishFormData }
  }
  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <div className="p-5">
            <button
              onClick={onNew}
              className="w-8 h-8 bg-purple-500 rounded-lg shadow-md border-black dark:border-white"
            >
              <PlusSmIcon className="w-8 text-white dark:text-black" />
            </button>
            <div
              className={gridTheme}
              style={{ height: '800px', width: '90%' }}
            >
              {loading ? (
                <Spinner />
              ) : (
                <AgGridReact
                  defaultColDef={defaultColumnDef}
                  rowData={postMetadata}
                  columnDefs={makeOrgVHRColumnDefs({
                    onEditClick: onEdit,
                    onDeleteClick: onDelete
                  })}
                  pagination
                  paginationPageSize={20}
                />
              )}
            </div>
            {error && <Error message="An error occured. Please try again." />}
            <PublishOpportunityModal
              open={publishModalOpen}
              onClose={onPublishClose}
              publisher={profile}
            />
            <ModifyOpportunityModal
              open={modifyModalOpen}
              onClose={onModifyClose}
              publisher={profile}
              id={currentModifyId}
              defaultValues={getFormDefaults()}
            />
          </div>
        </Card>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default OrganizationVHRTab
