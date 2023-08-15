import { PencilIcon, TrashIcon } from '@heroicons/react/outline'
import {
  CellClickedEvent,
  ColDef,
  IDateFilterParams,
  INumberFilterParams,
  ITextFilterParams
} from 'ag-grid-community'

import i18n from '@/i18n'

import CurrencyCell from './CurrencyCell'

export const defaultColumnDef = {
  resizable: true
}

interface IColumnDefParams {
  onEditClick: (id: string) => void
  onDeleteClick: (id: string) => void
}

export const makeOrgVHRColumnDefs = (params: IColumnDefParams): ColDef[] => {
  const keyPrefix = 'components.dashboard.organization.column-defs.opportunity'
  const getTranslation = (key: string) => {
    return i18n.t(`common:${keyPrefix}.${key}`)
  }

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
      headerName: getTranslation('name'),
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
      headerName: getTranslation('start-date'),
      filter: 'agDateColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as IDateFilterParams
    },
    {
      field: 'endDate',
      headerName: getTranslation('end-date'),
      filter: 'agDateColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as IDateFilterParams
    },
    {
      field: 'hoursPerWeek',
      headerName: getTranslation('hours'),
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as INumberFilterParams
    },
    {
      field: 'category',
      headerName: getTranslation('category'),
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    {
      field: 'website',
      headerName: getTranslation('website'),
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    {
      field: 'description',
      headerName: getTranslation('description'),
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    }
  ]
}

export const makeOrgCauseColumnDefs = (params: IColumnDefParams): ColDef[] => {
  const keyPrefix = 'components.dashboard.organization.column-defs.cause'
  const getTranslation = (key: string) => {
    return i18n.t(`common:${keyPrefix}.${key}`)
  }

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
      headerName: getTranslation('name'),
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    {
      field: 'category',
      headerName: getTranslation('category'),
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    {
      field: 'currency',
      headerName: getTranslation('currency'),
      filter: 'agTextColumnFilter',
      cellRenderer: CurrencyCell,
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    {
      field: 'contribution',
      headerName: getTranslation('contribution'),
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as INumberFilterParams
    },
    {
      field: 'goal',
      headerName: getTranslation('goal'),
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as INumberFilterParams
    },
    {
      field: 'recipient',
      headerName: getTranslation('recipient'),
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    {
      field: 'description',
      headerName: getTranslation('description'),
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    },
    {
      field: 'location',
      headerName: getTranslation('location'),
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply']
      } as ITextFilterParams
    }
  ]
}
