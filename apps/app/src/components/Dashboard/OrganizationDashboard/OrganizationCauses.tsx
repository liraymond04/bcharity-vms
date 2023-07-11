import React, { useCallback, useRef, useState } from 'react'

import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { defaultColumnDef, makeOrgColumnDefs } from './ColumnDefs'

const OrganizationCausesTab: React.FC = () => {
  const [rowData] = useState([
    {
      id: '0',
      activityName: 'activity 1',
      vhr: { current: 100, goal: 100 },
      assigned: 3
    },
    {
      id: '1',
      activityName: 'activity 2',
      vhr: { current: 100, goal: 100 },
      assigned: 3
    },
    {
      id: '2',
      activityName: 'activity 3',
      vhr: { current: 99, goal: 100 },
      assigned: 321
    }
  ])

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
        />
      </div>
    </div>
  )
}

export default OrganizationCausesTab
