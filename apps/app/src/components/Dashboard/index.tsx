import { NextPage } from 'next'
import SEO from '@components/utils/SEO'
import VolunteerDashboard from './VolunteerDashboard/VolunteerDashboard'

const Dashboard: NextPage = () => {
  return (
    <>
      <SEO title="Dashboard • BCharity VMS" />
      <VolunteerDashboard />
    </>
  )
}

export default Dashboard
