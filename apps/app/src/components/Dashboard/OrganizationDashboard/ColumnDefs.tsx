import { PencilIcon, TrashIcon } from '@heroicons/react/outline'
import { CellClickedEvent } from 'ag-grid-community'

export const defaultColumnDef = {
  resizable: true
}

interface IColumnDefParams {
  onEditClick: (id: string) => void
  onDeleteClick: (id: string) => void
}

export const makeOrgColumnDefs: (params: IColumnDefParams) => any = (
  params: IColumnDefParams
) => {
  return {
    ['EditRow']: {
      field: 'id',
      headerName: '',
      resizable: false,
      cellRenderer: (_: any) => {
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
      cellRenderer: (_: any) => {
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
      valueFormatter: (_: any) => {
        return '' // gets rid of ag-grid warning due to object data type, we use a custom cell renderer anyways
      },
      cellRenderer: (params: any) => {
        console.log('value ', params.value)
        return (
          <div>
            <meter
              className="progress progress-success w-full"
              value={params.value?.current}
              min={0}
              max={params.value?.goal}
              low={Math.trunc(params.value?.goal / 2)}
              high={params.value?.goal - 1}
              optimum={params.value?.goal}
            >
              {/* <p>{`${params.value?.current} / ${params.value?.goal}`}</p> */}
            </meter>
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
