import { PlusSmIcon } from '@heroicons/react/outline'
import { AgGridReact } from 'ag-grid-react'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import getCauseMetadata from '@/lib/lens-protocol/getCauseMetadata'
import usePostData from '@/lib/lens-protocol/usePostData'
import { useAppPersistStore } from '@/store/app'

import Error from '../Modals/Error'
import PublishCauseModal from '../Modals/PublishCauseModal'
import { defaultColumnDef, makeOrgCauseColumnDefs } from './ColumnDefs'

const OrganizationCausesTab: React.FC = () => {
  const { currentUser: profile } = useAppPersistStore()
  const { resolvedTheme } = useTheme()
  const [gridTheme, setGridTheme] = useState<string>()

  const { data, error, loading, refetch } = usePostData({
    profileId: profile!.id,
    metadata: {
      tags: { all: ['ORG_PUBLISH_CAUSE'] }
    }
  })

  const [publishModalOpen, setPublishModalOpen] = useState(false)

  const onNew = () => {
    setPublishModalOpen(true)
  }

  const onEdit = (id: string) => {
    console.log('edit id ', id)
  }

  const onDelete = (id: string) => {
    console.log('delete id ', id)
  }

  useEffect(() => {
    setGridTheme(
      resolvedTheme === 'light' ? 'ag-theme-alpine' : 'ag-theme-alpine-dark'
    )
  }, [resolvedTheme])

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
                  rowData={getCauseMetadata(data)}
                  columnDefs={Object.values(
                    makeOrgCauseColumnDefs({
                      onEditClick: onEdit,
                      onDeleteClick: onDelete
                    })
                  )}
                  pagination
                  paginationPageSize={20}
                />
              )}
            </div>
            {error && <Error message="An error occured. Please try again." />}
            <PublishCauseModal
              open={publishModalOpen}
              onClose={(shouldRefetch) => {
                setPublishModalOpen(false)

                if (shouldRefetch) {
                  refetch()
                }
              }}
              publisher={profile}
            />
          </div>
        </Card>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default OrganizationCausesTab
