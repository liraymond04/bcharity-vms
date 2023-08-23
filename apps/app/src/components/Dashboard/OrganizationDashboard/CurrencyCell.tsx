import { FC } from 'react'
import { useToken } from 'wagmi'

import { Spinner } from '@/components/UI/Spinner'

/**
 * Component that displays the name of a token given its address
 *
 * Used as a cell renderer in {@link ColumnDefs}
 */
const CurrencyCell: FC = (props: any) => {
  const currency = props?.data?.currency

  const { data, isLoading } = useToken({
    address: currency ?? ''
  })

  return <div>{isLoading ? <Spinner /> : data?.name}</div>
}

export default CurrencyCell
