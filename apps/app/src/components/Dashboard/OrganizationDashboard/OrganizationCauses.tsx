import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

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

  const onEdit = (id: string) => {
    console.log('edit id', id)
  }

  const onDelete = (id: string) => {
    console.log('delete id', id)
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className="ag-theme-alpine shadow-md shadow-violet-400"
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
        />
      </div>
    </div>
  )
}

export default OrganizationCausesTab
