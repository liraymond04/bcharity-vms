import ThemeButton from '@components/Shared/ThemeButton'
import { PhotographIcon } from '@heroicons/react/outline'
import React from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import { Card } from '@/components/UI/Card'

const VolunteerSettingsTab: React.FC = () => {
  return (
    <GridLayout>
      <GridItemTwelve>
        <Card className="border-black border-3">
          <div className="flex text-3xl font-bold mt-2 ml-2 mb-10">
            <PhotographIcon className="w-10 h-10" />
            Theme:
          </div>
          <section className="flex justify-center items-center text-center border-4 my-20 mx-80 rounded-xl px-10">
            {' '}
            <div className="text-2xl m-10">
              Toggle between light and dark mode.
            </div>
            <div className="text-2xl">
              <ThemeButton />
            </div>
          </section>
        </Card>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerSettingsTab
