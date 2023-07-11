import React, { useState } from 'react'

import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { defaultColumnDef, makeOrgColumnDefs } from './ColumnDefs'

const makeFakeData = () => {
  const data = []
  for (let i = 0; i < 150; i++) {
    data.push({
      id: i,
      activityName: `activity ${i}`,
      vhr: {
        current: i,
        goal: 150
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
    <div>
      <div className="ag-theme-alpine" style={{ height: 600, width: 600 }}>
        <AgGridReact
          defaultColDef={defaultColumnDef}
          rowData={rowData}
          columnDefs={Object.values(
            makeOrgColumnDefs({ onEditClick: onEdit, onDeleteClick: onDelete })
          )}
          pagination
        />
      </div>
    </div>
  )
}

export default OrganizationCausesTab
