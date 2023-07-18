import { FC, useEffect } from 'react'
import { useBalance } from 'wagmi'

import { VHR_TOKEN } from '@/constants'

interface Props {
  address: string
  callback: Function
}

const GetBalance: FC<Props> = ({ address, callback }) => {
  const { data, isLoading } = useBalance({
    address: `0x${address.substring(2)}`,
    token: `0x${VHR_TOKEN.substring(2)}`
  })

  useEffect(() => {
    callback(data, isLoading)
  }, [callback, data, isLoading])

  return <div />
}

export default GetBalance
