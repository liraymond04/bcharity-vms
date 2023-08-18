import React from 'react'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
const VolunteerManagmentTab: React.FC = () => {
  return (
    <GridLayout>
      <GridItemTwelve>
        <div></div>
        <div className="flex justify-around mb-20 flex-wrap">
          <div>Mays corner</div>
          <div>Michaels corner</div>
        </div>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerManagmentTab
