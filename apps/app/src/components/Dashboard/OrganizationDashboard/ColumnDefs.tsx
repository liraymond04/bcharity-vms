import { PencilIcon, TrashIcon } from '@heroicons/react/outline'
import { CellClickedEvent } from 'ag-grid-community'

export const defaultColumnDef = {
  resizable: true
}

interface IColumnDefParams {
  onEditClick: (id: string) => void
  onDeleteClick: (id: string) => void
}

export const makeOrgColumnDefs = (params: IColumnDefParams) => {
  return {
    ['EditRow']: {
      field: 'id',
      headerName: '',
      resizable: false,
      cellRenderer: () => {
        return <PencilIcon className="w-4 inline" />
      },
      onCellClicked: (event: CellClickedEvent) => {
        params.onEditClick(event.data.id)
      },
      width: 50
    },
    ['DeleteRow']: {
      field: 'id',
      headerName: '',
      resizable: false,
      cellRenderer: () => {
        return <TrashIcon className="w-4 inline" />
      },
      onCellClicked: (event: CellClickedEvent) => {
        params.onDeleteClick(event.data.id)
      },
      width: 50
    },
    ['ActivityName']: {
      field: 'activityName',
      filter: 'agTextColumnFilter'
    },
    ['VHR']: {
      field: 'vhr',
      headerName: 'VHR',
      resizable: false,
      valueFormatter: () => {
        return '' // gets rid of ag-grid warning due to object data type, we use a custom cell renderer anyways
      },
      cellRenderer: (params: any) => {
        console.log('value ', params.value)
        const progress = params.value?.current
        const total = params.value?.goal
        return (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-blue-700">{`${progress} / ${total}`}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${Math.trunc((progress / total) * 100)}%` }}
              ></div>
            </div>
          </div>
        )
      },
      width: 110
    },
    ['Assigned']: {
      field: 'assigned',
      filter: 'agNumberColumnFilter'
    }
  }
}
