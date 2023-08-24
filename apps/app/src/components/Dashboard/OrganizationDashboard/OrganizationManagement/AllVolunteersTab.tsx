import { SearchIcon } from '@heroicons/react/outline'
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { GridItemSix, GridLayout } from '@/components/GridLayout'
import { ClearFilters } from '@/components/Shared'
import { Card, ErrorMessage, Spinner } from '@/components/UI'
import { useVolunteers } from '@/lib/lens-protocol'
import { useAppPersistStore } from '@/store/app'

import { DashboardDropDown } from '../../VolunteerDashboard'
import PurpleBox from './PurpleBox'
import VolunteerDataCard from './VolunteerDataCard'

/**
 * Reference to the {@link AllVolunteersTab} component;
 */
export interface AllRef {
  /**
   * Function to refetch volunteers
   * @returns
   */
  refetch: () => void
}

/**
 * Properties of {@link AllVolunteersTab}
 */
export interface IAllVolunteersTabProps {
  /**
   * Whether the component should be shown
   */
  hidden: boolean
}

/**
 * Component that displays page for accepted volunteers tab in {@link VolunteerManagementTab}.
 *
 * Volunteers are fetched using the {@link useVolunteers} hook, given the organization's
 * profile.
 */
const AllVolunteersTab = forwardRef<AllRef | null, IAllVolunteersTabProps>(
  ({ hidden }, ref) => {
    const { t } = useTranslation('common', {
      keyPrefix: 'components.dashboard.organization.management.all'
    })
    const { currentUser: profile } = useAppPersistStore()

    const { loading, data, error, refetch } = useVolunteers({ profile })

    useImperativeHandle(ref, () => ({
      refetch
    }))

    const [selectedId, setSelectedId] = useState<string>('')

    const selectedValue = useMemo(() => {
      return data.find((val) => val.profile.id === selectedId) ?? null
    }, [data, selectedId])

    const [searchValue, setSearchValue] = useState('')
    const [categories] = useState<Set<string>>(new Set())
    const [selectedCategory, setSelectedCategory] = useState<string>('')

    return (
      <div className={`${hidden ? 'hidden' : ''} pt-5`}>
        <h1 className="text-3xl font-bold pb-3" suppressHydrationWarning>
          {t('title')}
        </h1>
        <div className="flex flex-wrap items-center">
          <div className="flex justify-between h-[50px] bg-accent-content items-center rounded-md border-violet-300 border-2 dark:bg-Input">
            <input
              suppressHydrationWarning
              className="focus:ring-0 border-none outline-none focus:border-none focus:outline-none bg-transparent rounded-2xl"
              type="text"
              value={searchValue}
              placeholder={t('search')}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
            <div className="h-5 w-5 mr-5">
              <SearchIcon />
            </div>
          </div>

          <div className="flex flex-wrap items-center py-2">
            <div className="h-[50px] z-10">
              <DashboardDropDown
                label={t('filter')}
                options={Array.from(categories)}
                onClick={(c) => setSelectedCategory(c)}
                selected={selectedCategory}
              ></DashboardDropDown>
            </div>
            <div className="py-2">
              <ClearFilters
                onClick={() => {
                  setSelectedCategory('')
                }}
              />
            </div>
          </div>
        </div>
        <GridLayout>
          <GridItemSix>
            <Card className="mb-2">
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
                          tab="all"
                          onClick={() => {
                            setSelectedId(
                              selectedId === item.profile.id
                                ? ''
                                : item.profile.id
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
          </GridItemSix>
          <GridItemSix>
            {selectedId !== '' && !!selectedValue && (
              <div className="pb-10">
                <VolunteerDataCard vol={selectedValue} />
              </div>
            )}
          </GridItemSix>
        </GridLayout>
      </div>
    )
  }
)

AllVolunteersTab.displayName = 'AllVolunteersTab'

export default AllVolunteersTab
