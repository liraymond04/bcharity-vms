import SEO from '@components/utils/SEO'
import { NextPage } from 'next'

import OrganizationDashboard from './OrganizationDashboard/OrganizationDashboard'

const Dashboard: NextPage = () => {
  return (
    <>
      <SEO title="Dashboard • BCharity VMS" />
      <OrganizationDashboard />
    </>
  )
}

export default Dashboard
