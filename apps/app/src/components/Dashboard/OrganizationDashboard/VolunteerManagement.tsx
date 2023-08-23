import { PlusCircleIcon, SearchIcon } from '@heroicons/react/outline'
import { ProfileFragment } from '@lens-protocol/client'
import React, { MouseEventHandler, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import ClearFilters from '@/components/Shared/ClearFilters'
import { Button } from '@/components/UI/Button'
import { Card } from '@/components/UI/Card'
import { ErrorMessage } from '@/components/UI/ErrorMessage'
import { Spinner } from '@/components/UI/Spinner'
import {
  checkAuth,
  getAvatar,
  lensClient,
  useCreateComment,
  useVolunteers
} from '@/lib/lens-protocol'
import useApplications from '@/lib/lens-protocol/useApplications'
import { ApplicationMetadata, buildMetadata, PostTags } from '@/lib/metadata'
import { useAppPersistStore } from '@/store/app'

import DashboardDropDown from '../VolunteerDashboard/DashboardDropDown'

interface VolunteerInfoProps {
  application: ApplicationMetadata
  onAccept: VoidFunction
  onReject: VoidFunction
  pending?: boolean
}

interface PurpleBoxProps {
  selected?: boolean
  userName: string
  dateCreated: string
  onClick?: MouseEventHandler<HTMLDivElement>
}

const PurpleBox: React.FC<PurpleBoxProps> = ({
  selected,
  userName,
  dateCreated,
  onClick
}) => {
  const boxClassName = selected
    ? 'bg-blue-100 dark:bg-violet-500'
    : 'bg-violet-200 dark:bg-Within dark:bg-opacity-10'
  return (
    <div
      className={`items-center shadow-sm shadow-black px-5 mx-5 my-3 h-16 py-2 ${boxClassName}`}
      onClick={onClick}
    >
      <div>{userName}</div>
      <div className="flex justify-end my-3">
        <div className="text-sm font-extralight">
          Application date created:&nbsp;
        </div>
        <div className="text-sm font-extralight">{dateCreated}</div>
      </div>
    </div>
  )
}

const VolunteerInfoCard: React.FC<VolunteerInfoProps> = ({
  application,
  onAccept,
  onReject,
  pending
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.volunteer-managment'
  })

  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const [userProfile, setUserProfile] = useState<ProfileFragment>()

  const [profileDataLoading, setProfileDataLoading] = useState(false)
  const [profileError, setProfileError] = useState('test')

  useEffect(() => {
    setProfileDataLoading(true)
    setProfileError('')

    lensClient()
      .profile.fetch({
        profileId: application.from.id
      })
      .then((p) => {
        if (p) {
          setUserProfile(p)
        } else {
          setProfileError(e('profile-null'))
        }
      })
      .catch((e) => {
        setProfileError(e?.message ?? e)
      })
      .finally(() => setProfileDataLoading(false))
  }, [application.from.id])

  const location = useMemo(() => {
    return userProfile?.attributes?.find((attr) => attr.key === 'location')
      ?.value
  }, [userProfile])

  return (
    <Card className="pt-10 pl-10 pr-10 justify-center">
      {profileError && <ErrorMessage error={new Error(profileError)} />}
      <div className="justify-center font-black text-3xl py-4">
        Volunteer Information
      </div>

      <div className="justify-start flex">
        <div className="text-violet-500">
          {application.from.name ?? application.from.handle}&nbsp;
        </div>
        <p> wants to work with your organization</p>
      </div>
      <div className="flex">
        {application.from.coverPicture !== undefined && (
          <img
            className="rounded-sm py-3"
            src={getAvatar(application.from)}
            alt="Rounded avatar"
            style={{ width: '100px', height: 'auto' }}
          />
        )}
        <div className="flex justify-between py-3 pl-5">
          <div className="text-violet-500">bio:&nbsp;</div>
          <p>{application.from.bio}</p>
        </div>
      </div>
      <div className="flex">
        <div className="text-violet-500">location:&nbsp;</div>
        {profileDataLoading ? <Spinner /> : <p>{location ?? ''}</p>}

        {/* placeholder */}
      </div>
      <div className="flex">
        <div className="text-violet-500">Application date created:&nbsp;</div>
        <p>{application.createdAt}</p>
      </div>
      <div className="flex mt-40">
        {' '}
        <Button
          className="my-5"
          suppressHydrationWarning
          onClick={onReject}
          disabled={pending}
        >
          Reject
        </Button>
        <Button
          className="my-5 ml-40"
          suppressHydrationWarning
          onClick={onAccept}
          disabled={pending}
        >
          Accept
        </Button>
      </div>
    </Card>
  )
}

/**
 * Component that displays a page to manage volunteer applications. Open applications
 * and application requests are fetched using the {@link useApplications} hook.
 *
 * Applications are accepted/rejected by adding a comment under the application post
 * using the {@link useCreateComment} hook and the {@link PostTags.Application.Accept}
 * or {@link PostTags.Application.REJECT} metadata tag.
 */
const VolunteerManagementTab: React.FC = () => {
  const { currentUser: profile } = useAppPersistStore()
  const { createComment } = useCreateComment()

  const [searchValue, setSearchValue] = useState('')
  const [categories] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedId, setSelectedId] = useState<string>('')

  const { loading, data, error, refetch } = useApplications({ profile })

  const selectedValue = useMemo(() => {
    return data.find((val) => val.post_id === selectedId) ?? null
  }, [data, selectedId])

  const [pendingIds, setPendingIds] = useState<Record<string, boolean>>({})
  const [verifyOrRejectError, setVerifyOrRejectError] = useState('')

  const setIdPending = (id: string) => {
    const newPendingIds = { ...pendingIds, [id]: true }
    setPendingIds(newPendingIds)
  }

  const removeIdPending = (id: string) => {
    setPendingIds({ ...pendingIds, [id]: false })
  }

  const onAcceptClick = async () => {
    if (profile === null) return

    setIdPending(selectedId)

    try {
      await checkAuth(profile.ownedBy)

      const metadata = buildMetadata(profile, [PostTags.Application.Accept], {})

      await createComment({
        publicationId: selectedId,
        metadata,
        profileId: profile.id
      })
    } catch (e: any) {
      setVerifyOrRejectError(e.message ?? e)
    }

    removeIdPending(selectedId)
  }

  const onRejectClick = async () => {
    if (profile === null) return

    setIdPending(selectedId)

    try {
      await checkAuth(profile.ownedBy)

      const metadata = buildMetadata(profile, [PostTags.Application.REJECT], {})

      await createComment({
        publicationId: selectedId,
        metadata,
        profileId: profile.id
      })
    } catch (e: any) {
      setVerifyOrRejectError(e.message ?? e)
    }

    removeIdPending(selectedId)
  }

  const volunteerData = useVolunteers({ profile })
  // console.log('volunteerdata', volunteerData)

  return (
    <GridLayout>
      <GridItemTwelve>
        {(verifyOrRejectError || error) && (
          <ErrorMessage error={new Error(verifyOrRejectError || error)} />
        )}
        <div className="flex item-center my-10 px-10">
          <div className="border-black bg-white text-black border-l px-2">
            All Volunteers
          </div>
          <div className="border-black bg-white text-black border-l px-2">
            Volunteers applications
          </div>
        </div>
        <div className="flex flex-wrap gap-y-5 justify-around items-center mt-10">
          <div className="flex justify-between w-[300px] h-[50px] bg-accent-content items-center rounded-md border-violet-300 border-2 ml-10 mr-10 dark:bg-Input">
            <input
              className="focus:ring-0 border-none outline-none focus:border-none focus:outline-none  bg-transparent rounded-2xl w-[250px]"
              type="text"
              value={searchValue}
              placeholder={'search'}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
            <div className="h-5 w-5 mr-5">
              <SearchIcon />
            </div>
          </div>

          <div className="flex flex-wrap gap-y-5 justify-around w-[420px] items-center">
            <div className="h-[50px] z-10 ">
              <DashboardDropDown
                label={'filter'}
                options={Array.from(categories)}
                onClick={(c) => setSelectedCategory(c)}
                selected={selectedCategory}
              ></DashboardDropDown>
            </div>
            <ClearFilters
              onClick={() => {
                setSelectedCategory('')
              }}
            />
          </div>
        </div>
        <div className="flex item-center justify-end pr-20 pt-10">
          Add a Volunteer
          <PlusCircleIcon className="w-8 text-brand-400" />
        </div>
        <div className="flex space-x-24 pt-5">
          <Card className={`h-1/2 w-1/2`}>
            <div className="scrollbar">
              {loading ? (
                <Spinner />
              ) : (
                <>
                  {data.map((item) => {
                    return (
                      <PurpleBox
                        key={item.post_id}
                        selected={selectedId === item.post_id}
                        userName={item.from.name ?? item.from.handle}
                        dateCreated={item.createdAt}
                        onClick={() => {
                          setSelectedId(
                            selectedId === item.post_id ? '' : item.post_id
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
              <VolunteerInfoCard
                application={selectedValue}
                onAccept={() => onAcceptClick()}
                onReject={() => onRejectClick()}
                pending={pendingIds[selectedId]}
              />
            </div>
          )}
        </div>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default VolunteerManagementTab
