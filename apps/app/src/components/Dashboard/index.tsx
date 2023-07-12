import { Spinner } from '@components/UI/Spinner'
import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import Router from 'next/router'
import { useEffect, useState } from 'react'

import { useAppPersistStore } from '@/store/app'

import OrganizationDashboard from './OrganizationDashboard/OrganizationDashboard'

const Dashboard: NextPage = () => {
  const { isAuthenticated, currentUser } = useAppPersistStore()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setLoading(false)
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
      <OrganizationDashboard />
    </>
  )
}

export default Dashboard
