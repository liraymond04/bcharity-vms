import { SearchIcon } from '@heroicons/react/outline'
import React, { useMemo, useState } from 'react'

import { Spinner } from '@/components/UI/Spinner'
import useVHRRequests from '@/lib/lens-protocol/useVHRRequests'
import { useAppPersistStore } from '@/store/app'

import Error from '../../Modals/Error'
import DashboardDropDown from '../../VolunteerDashboard/DashboardDropDown'
import VHRDetailCard from './VHRDetailCard'
import VHRVerifyCard from './VHRVerifyCard'

interface IOrganizationLogVHRProps {}

const OrganizationLogVHRTab: React.FC<IOrganizationLogVHRProps> = () => {
  const { currentUser: profile } = useAppPersistStore()

  const { loading, data, error, refetch } = useVHRRequests({ profile })
  const [selectedId, setSelectedId] = useState('')

  const selectedValue = useMemo(() => {
    return data.find((val) => val.id === selectedId) ?? null
  }, [data, selectedId])

  const onAcceptClick = (id: string) => {
    console.log('accept', id)

    const newData = data.filter((val) => id !== val.id)
  }

  const onRejectClick = (id: string) => {
    console.log('reject', id)

    const newData = data.filter((val) => id !== val.id)
  }

  return (
    <div className="mx-4 my-8 flex flex-col max-h-screen">
      <div className="flex flex-wrap gap-y-5 justify-around items-center mt-10">
        <div className="flex justify-between w-[300px] h-[50px] bg-white items-center rounded-md border-violet-300 border-2 ml-10 mr-10 dark:bg-black">
          <input
            className="focus:ring-0 border-none outline-none focus:border-none focus:outline-none  bg-transparent rounded-2xl w-[250px]"
            type="text"
            // value={searchValue}
            placeholder="Search"
            // onChange={(e) => {
            //   setSearchValue(e.target.value)
            // }}
          />
          <div className="h-5 w-5 mr-5">
            <SearchIcon />
          </div>
        </div>

        <div className="flex flex-wrap gap-y-5 justify-around w-[420px] items-center">
          <div className="h-[50px] z-10 ">
            <DashboardDropDown
              label="Filter:"
              options={[]}
              onClick={(c) => console.log('change filter', c)}
              selected={''}
            />
          </div>
        </div>
      </div>

      <button onClick={() => refetch()}>Refresh</button>
      {!loading ? (
        <>
          <div className="flex flex-col min-h-96 overflow-auto bg-zinc-50 shadow-md shadow-black px-4 py-3 rounded-md mt-10">
            {data.map((value) => {
              const selected = value.id === selectedId

              return (
                <VHRVerifyCard
                  selected={selected}
                  key={value.id}
                  value={value}
                  onClick={() => setSelectedId(selected ? '' : value.id)}
                  onAcceptClick={() => onAcceptClick(value.id)}
                  onRejectClick={() => onRejectClick(value.id)}
                />
              )
            })}
          </div>
          {selectedValue && <VHRDetailCard value={selectedValue} />}
        </>
      ) : (
        <Spinner />
      )}
      {error && (
        <Error message={`An error occured: ${error}. Please try again`}></Error>
      )}
    </div>
  )
}

export default OrganizationLogVHRTab
