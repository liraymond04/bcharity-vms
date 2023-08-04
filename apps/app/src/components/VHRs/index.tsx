import { Inter } from '@next/font/google'
import JSSoup from 'jssoup'
import { NextPage } from 'next'
import { SetStateAction, useEffect, useState } from 'react'

import { VHR_TOP_HOLDERS_URL } from '@/constants'
import isVerified from '@/lib/isVerified'
import getProfilesOwnedBy from '@/lib/lens-protocol/getProfilesOwnedBy'

import { Spinner } from '../UI/Spinner'

interface Item {
  index: number
  address: string
  handle: string
  amount: number
  percentage: string
  org: boolean
}

const inter500 = Inter({
  subsets: ['latin'],
  weight: ['500']
})

const VHRs: NextPage = () => {
  const [volunteerData, setVolunteerData] = useState<Item[]>()
  const [volunteersIsLoading, setVolunteersIsLoading] = useState<boolean>(false)

  const [organizationData, setOrganizationData] = useState<Item[]>()
  const [organizationsIsLoading, setOrganizationsIsLoading] =
    useState<boolean>(false)

  const sortItems = async (
    items: Item[],
    setData: (value: SetStateAction<Item[] | undefined>) => void,
    setIsLoading: (value: SetStateAction<boolean>) => void,
    verified: boolean
  ) => {
    let arr: Item[] = []
    for (let i = 0; i < items.length; i++) {
      let item = Object.create(items[i])
      let profiles = await getProfilesOwnedBy(item.address)
      profiles = profiles.filter(
        (profile) => isVerified(profile.id) === verified
      )
      item.handle = profiles[0]?.handle
      if (profiles.length > 0) {
        arr.push(item)
        setData(arr)
      }
    }
    setIsLoading(false)
  }

  const getHolders = async () => {
    setVolunteersIsLoading(true)
    setOrganizationsIsLoading(true)
    try {
      const response = await fetch(`api/cors?url=${VHR_TOP_HOLDERS_URL}`)
      const html = await response.text()

      // scraping
      const soup = new JSSoup(html)
      const tag = soup.findAll('td')
      let index = 0
      let items: Item[] = []
      let cur = []
      for (let i = 0; i < tag.length; i++) {
        cur[i % 4] = tag[i].text
        if (i % 4 === 0 && i !== 0) {
          items[index] = {
            index: index,
            address: cur[1],
            handle: '',
            amount: Number(cur[2]?.replace(/,/g, '')),
            percentage: cur[3],
            org: false
          }
          index++
        }
      }

      sortItems(items, setVolunteerData, setVolunteersIsLoading, false)
      sortItems(items, setOrganizationData, setOrganizationsIsLoading, true)
    } catch (e) {
      if (e instanceof Error) {
        console.log(e)
      }
      setVolunteersIsLoading(false)
      setOrganizationsIsLoading(false)
    }
  }

  useEffect(() => {
    getHolders()
  }, [])

  return (
    <div className={`${inter500.className}`}>
      <div className="flex justify-around items-center">
        <div className="text-3xl text-[#343434] mt-10 dark:text-[#E2E2E2]">
          Top VHR Holders
        </div>
      </div>
      <div className="flex justify-around mb-20 flex-wrap">
        <div className="min-w-[450px] mx-2 h-[550px] bg-[#F9F9F9] dark:bg-[#18004A] rounded-lg mt-10">
          <div className="text-2xl text-[#626262] dark:text-[#E2E2E2] my-5 mx-auto w-fit h-fit">
            Volunteers
          </div>
          <div className="overflow-y-scroll h-[470px]">
            {volunteerData &&
              volunteerData.map((value, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center w-[400px] h-[80px] mx-auto my-2 border-b-[1px] border-[#DDDDDD]"
                >
                  <div className="flex justify-between items-center">
                    <div className="ml-2 text-[#7E7E7E]">{index + 1}</div>
                    <div className="w-10 h-10 bg-[#498ade] mx-4 rounded-full"></div>
                    <a href={`/user/${value.handle}`} target="_blank">
                      <div
                        className={`${
                          index == 0
                            ? 'text-[#FFD600]'
                            : index == 1
                            ? 'text-[#CCCCCC]'
                            : index == 2
                            ? 'text-[#8E5E00]'
                            : 'text-[#A3A3A3]'
                        } `}
                      >
                        {value.handle}
                      </div>
                    </a>
                  </div>
                  <div className="text-[#A3A3A3] text-sm">
                    {value.amount} VHRs
                  </div>
                </div>
              ))}
            {volunteersIsLoading && (
              <div className="flex justify-between items-center w-[400px] h-[80px] mx-auto my-2 border-[#DDDDDD]">
                <Spinner />
              </div>
            )}
          </div>
        </div>
        <div className="min-w-[450px] mx-2 h-[550px] bg-[#F9F9F9] dark:bg-[#18004A] rounded-lg mt-10">
          <div className="text-2xl text-[#626262] dark:text-[#E2E2E2] my-5 mx-auto w-fit h-fit">
            Organizations
          </div>
          <div className="overflow-y-scroll h-[470px]">
            {organizationData &&
              organizationData.map((value, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center w-[400px] h-[80px] mx-auto my-2 border-b-[1px] border-[#DDDDDD]"
                >
                  <div className="flex justify-between items-center">
                    <div className="ml-2 text-[#7E7E7E]">{index + 1}</div>
                    <div className="w-10 h-10 bg-[#498ade] mx-4 rounded-full"></div>
                    <a href={`/user/${value.handle}`} target="_blank">
                      <div
                        className={`${
                          index == 0
                            ? 'text-[#FFD600]'
                            : index == 1
                            ? 'text-[#CCCCCC]'
                            : index == 2
                            ? 'text-[#8E5E00]'
                            : 'text-[#A3A3A3]'
                        } `}
                      >
                        {value.handle}
                      </div>
                    </a>
                  </div>
                  <div className="text-[#A3A3A3] text-sm">
                    {value.amount} VHRs
                  </div>
                </div>
              ))}
            {organizationsIsLoading && (
              <div className="flex justify-between items-center w-[400px] h-[80px] mx-auto my-2 border-[#DDDDDD]">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VHRs
