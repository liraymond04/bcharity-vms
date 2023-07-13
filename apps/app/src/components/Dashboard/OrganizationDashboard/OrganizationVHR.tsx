import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { PlusSmIcon } from '@heroicons/react/solid'
import { Post, usePublications } from '@lens-protocol/react-web'
import { AgGridReact } from 'ag-grid-react'
import React, { useEffect, useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import { OpportunityMetadata } from '@/lib/types'
import { useAppPersistStore } from '@/store/app'

import PublishOpportunityModal from '../Modals/PublishOpportunityModal'
import { defaultColumnDef, makeOrgVHRColumnDefs } from './ColumnDefs'

const OrganizationVHRTab: React.FC = () => {
  const { currentUser: profile } = useAppPersistStore()

  const { data, error, loading } = usePublications({
    profileId: profile!.id,
    observerId: profile!.id,
    metadataFilter: {
      restrictPublicationTagsTo: {
        all: ['ORG_PUBLISH_OPPORTUNITY']
      }
    }
  })

  const [rowData, setRowData] = useState<OpportunityMetadata[]>([])

  const [publishModalOpen, setPublishModalOpen] = useState(false)

  useEffect(() => {
    if (data || (data && publishModalOpen === false)) {
      const d: OpportunityMetadata[] = data.map((publication) => {
        return JSON.parse((publication as Post).metadata.content!)
      })
      setRowData(d)
    }
  }, [data, publishModalOpen])

  console.log('data', data)
  console.log('error', error)

  const onNew = () => {
    setPublishModalOpen(true)
  }

  const onEdit = (id: string) => {
    console.log('edit id ', id)
  }

  const onDelete = (id: string) => {
    console.log('delete id ', id)
  }

  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <div className="p-5">
            <button
              onClick={onNew}
              className="w-8 h-8 bg-purple-500 rounded-lg shadow-md border-black"
            >
              <PlusSmIcon className="w-8 text-white" />
            </button>
            <div
              className="ag-theme-alpine"
              style={{ height: '800px', width: '90%' }}
            >
              {loading ? (
                <Spinner />
              ) : (
                <AgGridReact
                  defaultColDef={defaultColumnDef}
                  rowData={rowData}
                  columnDefs={Object.values(
                    makeOrgVHRColumnDefs({
                      onEditClick: onEdit,
                      onDeleteClick: onDelete
                    })
                  )}
                  pagination
                  paginationPageSize={20}
                />
              )}
            </div>
            <PublishOpportunityModal
              open={publishModalOpen}
              onClose={() => setPublishModalOpen(false)}
              publisher={{ ...profile!, ownedByMe: true }}
            />
          </div>
        </Card>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default OrganizationVHRTab
