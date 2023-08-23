import { useMemo, useState } from 'react'

import { Card, ErrorMessage, Spinner } from '@/components/UI'
import { useVolunteers } from '@/lib/lens-protocol'
import { useAppPersistStore } from '@/store/app'

import PurpleBox from './PurpleBox'
import VolunteerDataCard from './VolunteerDataCard'

interface IAllVolunteersTabProps {
  hidden: boolean
}

const AllVolunteersTab: React.FC<IAllVolunteersTabProps> = ({ hidden }) => {
  const { currentUser: profile } = useAppPersistStore()

  const { loading, data, error, refetch } = useVolunteers({ profile })

  const [selectedId, setSelectedId] = useState<string>('')

  const selectedValue = useMemo(() => {
    return data.find((val) => val.profile.id === selectedId) ?? null
  }, [data, selectedId])

  return (
    <div className={`${hidden ? 'hidden' : ''} flex space-x-24 pt-5`}>
      <Card className={`h-1/2 w-1/2`}>
        {error && <ErrorMessage error={new Error(error)} />}
        <div className="scrollbar">
          {loading ? (
            <Spinner />
          ) : (
            <>
              {data.map((item) => {
                return (
                  <PurpleBox
                    key={item.profile.id}
                    selected={selectedId === item.profile.id}
                    userName={item.profile.name ?? item.profile.handle}
                    dateCreated={item.dateJoined}
                    onClick={() => {
                      setSelectedId(
                        selectedId === item.profile.id ? '' : item.profile.id
                      )
                    }}
                  />
                )
              })}
            </>
          )}

          {/* the box placeholder for the data ^ */}
        </div>
      </Card>
      {selectedId !== '' && !!selectedValue && (
        <div className="pb-10">
          <VolunteerDataCard vol={selectedValue} />
        </div>
      )}
    </div>
  )
}

export default AllVolunteersTab
