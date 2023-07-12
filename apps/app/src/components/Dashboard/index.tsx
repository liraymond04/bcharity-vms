import { Spinner } from '@components/UI/Spinner'
import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import Router from 'next/router'
import { useEffect, useState } from 'react'

import isVerified from '@/lib/isVerified'
import { useAppPersistStore } from '@/store/app'

import OrganizationDashboard from './OrganizationDashboard/OrganizationDashboard'
import VolunteerDashboard from './VolunteerDashboard/VolunteerDashboard'

const Dashboard: NextPage = () => {
  const { isAuthenticated, currentUser } = useAppPersistStore()
  const [loading, setLoading] = useState<boolean>(true)

  const [isOrganization, setIsOrganization] = useState<boolean>(false)

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setLoading(false)
      setIsOrganization(isVerified(currentUser.id))
    } else {
      Router.push('/')
    }
  }, [currentUser, isAuthenticated])

  return loading ? (
    <center className="pt-20">
      <Spinner />
    </center>
  ) : (
    <>
      <SEO title="Dashboard • BCharity VMS" />
      {isOrganization ? <OrganizationDashboard /> : <VolunteerDashboard />}
    </>
  )
}

export default Dashboard
