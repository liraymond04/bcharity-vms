import { Inter } from '@next/font/google'
import JSSoup from 'jssoup'
import { NextPage } from 'next'
import { SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CORS_PROXY, VHR_TOP_HOLDERS_URL } from '@/constants'
import getAvatar from '@/lib/getAvatar'
import isVerified from '@/lib/isVerified'
import getProfilesOwnedBy from '@/lib/lens-protocol/getProfilesOwnedBy'

import { GridItemTwelve, GridLayout } from '../GridLayout'
import SEO from '../utils/SEO'
import Column from './Column'

export interface Item {
  index: number
  address: string
  handle: string
  amount: number
  percentage: string
  avatar: string
}

const inter500 = Inter({
  subsets: ['latin'],
  weight: ['500']
})

const VHRs: NextPage = () => {
  const { t } = useTranslation('common', { keyPrefix: 'components.vhrs' })

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
      let item: Item = Object.create(items[i])
      let profiles = await getProfilesOwnedBy(item.address)
      profiles = profiles.filter(
        (profile) => isVerified(profile.id) === verified
      )
      item.handle = profiles[0]?.handle
      if (profiles.length > 0) {
        item.avatar = getAvatar(profiles[0])
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
      const url = CORS_PROXY + encodeURIComponent(VHR_TOP_HOLDERS_URL)
      const response = await fetch(url)
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
            avatar: ''
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
    <>
      <SEO title="VHRs • BCharity VMS" />
      <GridLayout>
        <GridItemTwelve>
          <div className={`${inter500.className}`}>
            <div className="flex justify-around items-center">
              <div
                className="text-3xl text-[#343434] mt-10 dark:text-[#E2E2E2]"
                suppressHydrationWarning
              >
                {t('top-holders')}
              </div>
            </div>
            <div className="flex justify-around mb-20 flex-wrap">
              <Column
                label={t('volunteers')}
                data={volunteerData}
                isLoading={volunteersIsLoading}
              />
              <Column
                label={t('organizations')}
                data={organizationData}
                isLoading={organizationsIsLoading}
              />
            </div>
          </div>
        </GridItemTwelve>
      </GridLayout>
    </>
  )
}

export default VHRs
