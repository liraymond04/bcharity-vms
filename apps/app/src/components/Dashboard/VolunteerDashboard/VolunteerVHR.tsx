import React, { useEffect, useState } from 'react'
import { useBalance } from 'wagmi'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import { VHR_TOKEN } from '@/constants'
import { useAppPersistStore } from '@/store/app'

const VolunteerVHRTab: React.FC = () => {
  const { isAuthenticated, currentUser } = useAppPersistStore()

  const [searchAddress, setSearchAddress] = useState<string>('')

  const { data, isLoading } = useBalance({
    address: `0x${searchAddress.substring(2)}`,
    token: `0x${VHR_TOKEN.substring(2)}`
  })

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setSearchAddress(currentUser.ownedBy)
    }
  }, [currentUser, isAuthenticated])

  console.log(data)

  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <div className="p-10 m-10">
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="flex items-center">
                <div className="text-2xl font-bold text-black sm:text-4xl">
                  VHR Amount:
                </div>
                <div className="text-2xl font-extrabold text-black sm:text-7xl pl-10">
                  {Number(data?.value)}
                </div>
              </div>
            )}
          </div>
        </Card>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerVHRTab
