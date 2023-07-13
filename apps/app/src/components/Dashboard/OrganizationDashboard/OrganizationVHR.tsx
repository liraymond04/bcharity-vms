import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { PlusSmIcon } from '@heroicons/react/solid'
import { AgGridReact } from 'ag-grid-react'
import React, { useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'
import { useAppPersistStore } from '@/store/app'

import PublishOpportunityModal from '../Modals/PublishOpportunityModal'
import { defaultColumnDef, makeOrgColumnDefs } from './ColumnDefs'

const makeFakeData = () => {
  let n = 120
  const data = []
  for (let i = 0; i < n + 1; i++) {
    data.push({
      id: i,
      activityName: `activity ${i}`,
      vhr: {
        current: i,
        goal: n
      },
      assigned: i
    })
  }
  return data
}

const OrganizationVHRTab: React.FC = () => {
  const [rowData] = useState(makeFakeData())

  const { currentUser: profile } = useAppPersistStore()

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
              <AgGridReact
                defaultColDef={defaultColumnDef}
                rowData={rowData}
                columnDefs={Object.values(
                  makeOrgColumnDefs({
                    onEditClick: onEdit,
                    onDeleteClick: onDelete
                  })
                )}
                pagination
                paginationPageSize={20}
              />
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
