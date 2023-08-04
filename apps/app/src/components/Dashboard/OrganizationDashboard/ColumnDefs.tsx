import { PencilIcon, TrashIcon } from '@heroicons/react/outline'
import {
  CellClickedEvent,
  ColDef,
  IDateFilterParams,
  INumberFilterParams,
  ITextFilterParams
} from 'ag-grid-community'

import CurrencyCell from './CurrencyCell'

export const defaultColumnDef = {
  resizable: true
}

interface IColumnDefParams {
  onEditClick: (id: string) => void
  onDeleteClick: (id: string) => void
}

export const makeOrgVHRColumnDefs = (params: IColumnDefParams): ColDef[] => {
  return [
    {
      field: 'edit',
      headerName: '',
      resizable: false,
      cellRenderer: () => {
        return <PencilIcon className="w-4 inline" />
      },
      onCellClicked: (event: CellClickedEvent) => {
        params.onEditClick(event.data['id'])
      },
      width: 50
    },
    {
      field: 'delete',
      headerName: '',
      resizable: false,
      cellRenderer: () => {
        return <TrashIcon className="w-4 inline" />
      },
      onCellClicked: (event: CellClickedEvent) => {
        params.onDeleteClick(event.data['id'])
      },
      width: 50
    },
    {
      field: 'name',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    // {
    //   field: 'vhr',
    //   headerName: 'VHR',
    //   resizable: false,
    //   valueFormatter: () => {
    //     return '' // gets rid of ag-grid warning due to object data type, we use a custom cell renderer anyways
    //   },
    //   cellRenderer: (params: any) => {
    //     const progress = params.value?.current
    //     const total = params.value?.goal
    //     return (
    //       <div>
    //         <div className="flex justify-between mb-1">
    //           <span className="text-sm font-medium text-blue-700">{`${progress} / ${total}`}</span>
    //         </div>
    //         <div className="w-full bg-gray-200 rounded-full h-2.5">
    //           <div
    //             className="bg-blue-600 h-2.5 rounded-full"
    //             style={{ width: `${Math.trunc((progress / total) * 100)}%` }}
    //           ></div>
    //         </div>
    //       </div>
    //     )
    //   },
    //   width: 110
    // },
    {
      field: 'startDate',
      filter: 'agDateColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as IDateFilterParams
    },
    {
      field: 'endDate',
      filter: 'agDateColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as IDateFilterParams
    },
    {
      field: 'hoursPerWeek',
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as INumberFilterParams
    },
    {
      field: 'category',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    {
      field: 'website',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    {
      field: 'description',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    }
  ]
}

export const makeOrgCauseColumnDefs = (params: IColumnDefParams): ColDef[] => {
  return [
    {
      field: 'edit',
      headerName: '',
      resizable: false,
      cellRenderer: () => {
        return <PencilIcon className="w-4 inline" />
      },
      onCellClicked: (event: CellClickedEvent) => {
        params.onEditClick(event.data['id'])
      },
      width: 50
    },
    {
      field: 'delete',
      headerName: '',
      resizable: false,
      cellRenderer: () => {
        return <TrashIcon className="w-4 inline" />
      },
      onCellClicked: (event: CellClickedEvent) => {
        params.onDeleteClick(event.data['id'])
      },
      width: 50
    },
    {
      field: 'name',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    {
      field: 'category',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    {
      field: 'currency',
      filter: 'agTextColumnFilter',
      cellRenderer: CurrencyCell,
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    {
      field: 'contribution',
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as INumberFilterParams
    },
    {
      field: 'goal',
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as INumberFilterParams
    },
    {
      field: 'recipient',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    {
      field: 'description',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    {
      field: 'location',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    }
  ]
}
