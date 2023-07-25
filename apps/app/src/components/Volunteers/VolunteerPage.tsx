import { NextPage } from 'next'
import { useRouter } from 'next/router'

import usePublication from '@/lib/lens-protocol/usePublication'

import { Spinner } from '../UI/Spinner'

const VolunteerPage: NextPage = () => {
  const {
    query: { id }
  } = useRouter()

  const { data, loading } = usePublication({
    publicationId: Array.isArray(id) ? '' : id
  })

  return loading ? <Spinner /> : <div>{data?.id}</div>
}

export default VolunteerPage
