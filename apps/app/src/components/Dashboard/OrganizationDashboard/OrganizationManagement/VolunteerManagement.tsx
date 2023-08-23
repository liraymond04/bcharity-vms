import { PlusCircleIcon, SearchIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import ClearFilters from '@/components/Shared/ClearFilters'

import DashboardDropDown from '../../VolunteerDashboard/DashboardDropDown'
import AllVolunteersTab from './AllVolunteersTab'
import VolunteerApplicationsTab from './VolunteerApplicationsTab'

const VolunteerManagementTab: React.FC = () => {
  const [searchValue, setSearchValue] = useState('')
  const [categories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  return (
    <GridLayout>
      <GridItemTwelve>
        <div className="flex item-center my-10 px-10">
          <div className="border-black bg-white text-black border-l px-2">
            All Volunteers
          </div>
          <div className="border-black bg-white text-black border-l px-2">
            Volunteers applications
          </div>
        </div>
        <div className="flex flex-wrap gap-y-5 justify-around items-center mt-10">
          <div className="flex justify-between w-[300px] h-[50px] bg-accent-content items-center rounded-md border-violet-300 border-2 ml-10 mr-10 dark:bg-Input">
            <input
              className="focus:ring-0 border-none outline-none focus:border-none focus:outline-none  bg-transparent rounded-2xl w-[250px]"
              type="text"
              value={searchValue}
              placeholder={'search'}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
            <div className="h-5 w-5 mr-5">
              <SearchIcon />
            </div>
          </div>

          <div className="flex flex-wrap gap-y-5 justify-around w-[420px] items-center">
            <div className="h-[50px] z-10 ">
              <DashboardDropDown
                label={'filter'}
                options={Array.from(categories)}
                onClick={(c) => setSelectedCategory(c)}
                selected={selectedCategory}
              ></DashboardDropDown>
            </div>
            <ClearFilters
              onClick={() => {
                setSelectedCategory('')
              }}
            />
          </div>
        </div>
        <div className="flex item-center justify-end pr-20 pt-10">
          Add a Volunteer
          <PlusCircleIcon className="w-8 text-brand-400" />
        </div>
        <VolunteerApplicationsTab hidden={false} />
        <AllVolunteersTab hidden={false} />
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerManagementTab
