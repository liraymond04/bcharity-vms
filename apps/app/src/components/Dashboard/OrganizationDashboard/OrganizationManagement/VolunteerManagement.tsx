import { PlusCircleIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'

import AllVolunteersTab from './AllVolunteersTab'
import VolunteerApplicationsTab from './VolunteerApplicationsTab'

/**
 * Component that displays a page to manage volunteer applications. Open applications
 * and application requests are fetched using the {@link useApplications} hook.
 *
 * Applications are accepted/rejected by adding a comment under the application post
 * using the {@link useCreateComment} hook and the {@link PostTags.Application.Accept}
 * or {@link PostTags.Application.REJECT} metadata tag.
 */
const VolunteerManagementTab: React.FC = () => {
  const [openTab, setOpenTab] = useState(0)

  const tabs = [
    {
      title: 'All Volunteers'
    },
    {
      title: 'Volunteer Applications'
    }
  ]

  return (
    <GridLayout>
      <GridItemTwelve>
        <div className="flex items-center mt-10 px-10">
          {tabs.map((t, i) => (
            <p
              key={i}
              className={`border-black text-black border-l px-2 ${
                openTab === i ? 'bg-zinc-300' : 'bg-white'
              }`}
              onClick={() => setOpenTab(i)}
            >
              {t.title}
            </p>
          ))}
          <div className="flex items-center justify-end pr-20 ml-auto">
            <p>Add a Volunteer</p>
            <PlusCircleIcon className="ml-2 w-8 text-brand-400" />
          </div>
        </div>
        <div className="ml-5">
          <VolunteerApplicationsTab hidden={openTab !== 0} />
          <AllVolunteersTab hidden={openTab !== 1} />
        </div>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerManagementTab
