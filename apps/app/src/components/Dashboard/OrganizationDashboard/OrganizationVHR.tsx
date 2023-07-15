import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { PlusSmIcon } from '@heroicons/react/solid'
import { PublicationMetadataV2Input } from '@lens-protocol/client'
import { AgGridReact } from 'ag-grid-react'
import React, { useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import usePostData from '@/lib/lens-protocol/usePostData'
import { OpportunityMetadata } from '@/lib/types'
import { useAppPersistStore } from '@/store/app'

import Error from '../Modals/Error'
import PublishOpportunityModal from '../Modals/PublishOpportunityModal'
import { defaultColumnDef, makeOrgVHRColumnDefs } from './ColumnDefs'

const OrganizationVHRTab: React.FC = () => {
  const { currentUser: profile } = useAppPersistStore()

  const { data, error, loading, refetch } =
    usePostData<PublicationMetadataV2Input>({
      profileId: profile!.id,
      metadata: {
        tags: { all: ['ORG_PUBLISH_OPPORTUNITY'] }
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
                  rowData={data.map((post): OpportunityMetadata => {
                    const attributes = post.attributes
                    return {
                      opportunity_id: attributes[1].value,
                      name: attributes[2].value,
                      date: attributes[3].value,
                      hours: attributes[4].value,
                      program: attributes[5].value,
                      region: attributes[6].value,
                      category: attributes[7].value,
                      website: attributes[8].value,
                      description: attributes[9].value
                    }
                  })}
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
            {error && <Error message="An error occured. Please try again." />}
            <PublishOpportunityModal
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

export default OrganizationVHRTab
