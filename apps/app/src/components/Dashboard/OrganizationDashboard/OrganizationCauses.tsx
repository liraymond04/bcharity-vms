import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { PlusSmIcon } from '@heroicons/react/solid'
import { AgGridReact } from 'ag-grid-react'
import React, { useState } from 'react'

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

const OrganizationCausesTab: React.FC = () => {
  const [rowData] = useState(makeFakeData())

  const onNew = () => {
    console.log('create new opportunity modal')
  }

  const onEdit = (id: string) => {
    console.log('edit id ', id)
  }

  const onDelete = (id: string) => {
    console.log('delete id ', id)
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-12 py-8">
      <div className="grow">
        <button className="w-8 h-8 bg-purple-500 rounded-lg shadow-md border-black">
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
      </div>
    </div>
  )
}

export default OrganizationCausesTab
