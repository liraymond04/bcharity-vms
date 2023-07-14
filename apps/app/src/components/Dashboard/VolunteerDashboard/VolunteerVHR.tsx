import { Inter } from '@next/font/google'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useBalance } from 'wagmi'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import { VHR_TOKEN } from '@/constants'
import { useAppPersistStore } from '@/store/app'

const inter500 = Inter({
  subsets: ['latin'],
  weight: ['500']
})

const VolunteerVHRTab: React.FC = () => {
  const { isAuthenticated, currentUser } = useAppPersistStore()

  const [searchAddress, setSearchAddress] = useState<string>('')
  const [vhrGoal, setVhrGoal] = useState(600) // use hardcoded goal for now
  const opportunityNames = [
    'Professional Hamburger Machine Operator 1',
    'Professional Hamburger Machine Operator 2',
    'Professional Hamburger Machine Operator 3',
    'Professional Hamburger Machine Operator 4'
  ] //use hardcoded names for now
  const [searchValue, setSearchValue] = useState('')

  const { data, isLoading } = useBalance({
    address: `0x${searchAddress.substring(2)}`,
    token: `0x${VHR_TOKEN.substring(2)}`
  })

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setSearchAddress(currentUser.ownedBy)
    }
  }, [currentUser, isAuthenticated])

  const Progress = ({
    progress,
    total,
    className
  }: {
    progress: number
    total: number
    className?: string
  }) => (
    <div className={className}>
      <div className="w-full bg-gray-200 rounded-full h-5 ">
        <div
          className="bg-green-400 h-5 rounded-full"
          style={{
            width: `${Math.min(Math.trunc((progress / total) * 100), 100)}%`
          }}
        ></div>
      </div>
    </div>
  )

  function filterOpportunity(name: string, search: string): boolean {
    const nameArr = name.split(' ')
    const searchArr = search.split(' ')
    let result = true
    searchArr.map((search) => {
      let found = false
      nameArr.map((name) => {
        let p0 = 0
        let p1 = 0
        while (p0 < name.length && p1 < search.length) {
          if (
            name.charAt(p0).toLowerCase() == search.charAt(p1).toLowerCase()
          ) {
            p0++, p1++
          } else {
            p0++
          }
        }
        if (p1 == search.length) {
          found = true
        }
      })
      if (!found) {
        result = false
      }
    })

    return result
  }

  return (
    <>
      <GridLayout>
        <GridItemTwelve>
          <Card>
            <div className="p-10 m-10">
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-black dark:text-white sm:text-4xl">
                      VHR Amount:
                    </div>
                    <div className="text-2xl font-extrabold text-black dark:text-white sm:text-7xl pl-10">
                      {Number(data?.value)} / {vhrGoal}
                    </div>
                  </div>
                  <Link
                    href=""
                    className="text-brand-500 hover:text-brand-600"
                    onClick={() => {
                      console.log('Set a goal')
                    }}
                  >
                    Set a goal
                  </Link>
                  <Progress
                    progress={Number(data?.value)}
                    total={vhrGoal}
                    className="mt-10 mb-10"
                  />
                  {Number(data?.value) < vhrGoal ? (
                    <div className="text-2xl font-normal text-black dark:text-white sm:text-2x l">
                      {vhrGoal - Number(data?.value)} away from goal!
                    </div>
                  ) : (
                    <div className="text-2xl font-normal text-black dark:text-white sm:text-2xl">
                      Reached goal!
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </GridItemTwelve>
      </GridLayout>
      <div>
        <input
          type="text"
          value={searchValue}
          placeholder="search"
          onChange={(e) => {
            setSearchValue(e.target.value)
          }}
        />
      </div>
      <div className="flex flex-wrap justify-around mx-auto">
        {opportunityNames
          .filter((name) => filterOpportunity(name, searchValue))
          .map((filterName, id) => (
            <div
              key={id}
              className="relative my-5 mx-5 w-[300px] h-[350px] bg-slate-100 border-8 border-white rounded-md"
            >
              <div className="w-full h-[200px] bg-black"></div>
              <div
                className={`flex justify-center text-center mt-5 text-xl ${inter500.className}`}
              >
                {filterName}
              </div>
              <div
                className={`flex justify-center bg-purple-500 py-1 px-12 w-20 rounded-3xl text-sm text-white absolute bottom-2 right-2 ${inter500.className}`}
              >
                APPLY
              </div>
            </div>
          ))}
        <div className="relative my-5 mx-5 w-[300px] h-[350px] bg-slate-100 border-8 border-white rounded-md opacity-0"></div>
        <div className="relative my-5 mx-5 w-[300px] h-[350px] bg-slate-100 border-8 border-white rounded-md opacity-0"></div>
        <div className="relative my-5 mx-5 w-[300px] h-[350px] bg-slate-100 border-8 border-white rounded-md opacity-0"></div>
      </div>
    </>
  )
}

export default VolunteerVHRTab
