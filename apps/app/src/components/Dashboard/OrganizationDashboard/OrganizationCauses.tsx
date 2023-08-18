import { PlusCircleIcon } from '@heroicons/react/outline'
import {
  PublicationsQueryRequest,
  PublicationTypes
} from '@lens-protocol/client'
import { useSDK, useStorageUpload } from '@thirdweb-dev/react'
import { signTypedData } from '@wagmi/core'
import { AgGridReact } from 'ag-grid-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { v4 } from 'uuid'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import GridRefreshButton from '@/components/Shared/GridRefreshButton'
import Progress from '@/components/Shared/Progress'
import { Button } from '@/components/UI/Button'
import { Card } from '@/components/UI/Card'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import {
  getSignature,
  lensClient,
  useEnabledCurrencies,
  usePostData
} from '@/lib/lens-protocol'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import {
  CauseMetadata,
  getCauseMetadata,
  isPost,
  PostTags
} from '@/lib/metadata'
import {
  AttributeData,
  MetadataDisplayType,
  MetadataVersion,
  ProfileMetadata
} from '@/lib/types'
import { useWalletBalance } from '@/lib/useBalance'
import { useAppPersistStore } from '@/store/app'

import DeleteCauseModal from '../Modals/DeleteCauseModal'
import ErrorMessage from '../Modals/Error'
import GoalModal from '../Modals/GoalModal'
import ModifyCauseModal from '../Modals/ModifyCauseModal'
import PublishCauseModal, {
  emptyPublishFormData,
  IPublishCauseFormProps
} from '../Modals/PublishCauseModal'
import { defaultColumnDef, makeOrgCauseColumnDefs } from './ColumnDefs'

const OrganizationCauses: React.FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.causes'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const { currentUser: profile } = useAppPersistStore()
  const { resolvedTheme } = useTheme()
  const [gridTheme, setGridTheme] = useState<string>()
  const [postMetadata, setPostMetadata] = useState<CauseMetadata[]>([])
  const [bio, setBio] = useState<string>('')

  const [modifyModalOpen, setModifyModalOpen] = useState(false)
  const { mutateAsync: upload } = useStorageUpload()
  const sdk = useSDK()
  const [currentModifyId, setCurrentModifyId] = useState('')
  const [currentDeleteId, setCurrentDeleteId] = useState('')
  const { data, error, loading, refetch } = usePostData(profile?.id, {
    metadata: {
      tags: { all: [PostTags.OrgPublish.Cause] }
    }
  })

  const [location, setLocation] = useState<string>('')
  const [errora, setErrora] = useState<Error>()
  const [website, setWebsite] = useState<string>('')
  const [discord, setDiscord] = useState<string>('')
  const [twitter, setTwitter] = useState<string>('')
  const [linkedin, setLinkedin] = useState<string>('')
  const [causeDescription, setCauseDescription] = useState<string>('')
  const [cover, setCover] = useState<File | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [GoalModalOpen, setGoalModalOpen] = useState(false)
  const { currentUser } = useAppPersistStore()
  const [name, setName] = useState<string>('')

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setErrora(undefined)
        if (currentUser) {
          setUserId(currentUser.id)
          setUserHandle(currentUser.handle)

          const userProfile = await lensClient().profile.fetch({
            profileId: currentUser?.id
          })

          if (userProfile) {
            setName(userProfile.name || '')

            if (userProfile.attributes) {
              const locationAttribute = userProfile.attributes.find(
                (attr) => attr.key === 'location'
              )
              setLocation(locationAttribute?.value || '')
              const websiteAttribute = userProfile.attributes.find(
                (attr) => attr.key === 'website'
              )
              setWebsite(websiteAttribute?.value || '')
              const discordAttribute = userProfile.attributes.find(
                (attr) => attr.key === 'discord'
              )
              setDiscord(discordAttribute?.value || '')
              const twitterAttribute = userProfile.attributes.find(
                (attr) => attr.key === 'twitter'
              )
              setTwitter(twitterAttribute?.value || '')
              const linkedinAttribute = userProfile.attributes.find(
                (attr) => attr.key === 'linkedin'
              )
              setLinkedin(linkedinAttribute?.value || '')
              const causeDescriptionAttribute = userProfile.attributes.find(
                (attr) => attr.key === 'causeDescription'
              )
              setCauseDescription(causeDescriptionAttribute?.value || '')
              console.log('descripton', causeDescriptionAttribute)
            }
            setBio(userProfile.bio || '')
          }
          console.log('profile', userProfile)
        }
      } catch (error) {
        if (errora instanceof Error) {
        }
      }
    }
    fetchProfileData()
  }, [currentUser])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      if (currentUser) {
        await checkAuth(currentUser?.ownedBy)

        const attributes: AttributeData[] = [
          {
            displayType: MetadataDisplayType.string,
            traitType: 'website',
            value: website,
            key: 'website'
          },
          {
            displayType: MetadataDisplayType.string,
            traitType: 'location',
            value: location,
            key: 'location'
          },
          {
            displayType: MetadataDisplayType.string,
            traitType: 'discord',
            value: discord,
            key: 'discord'
          },
          {
            displayType: MetadataDisplayType.string,
            traitType: 'twitter',
            value: twitter,
            key: 'twitter'
          },
          {
            displayType: MetadataDisplayType.string,
            traitType: 'linkedin',
            value: linkedin,
            key: 'linkedin'
          },
          {
            displayType: MetadataDisplayType.string,
            traitType: 'causeDescription',
            value: causeDescription,
            key: 'causeDescription'
          }
        ]

        const avatarUrl = cover ? (await upload({ data: [cover] }))[0] : null

        const metadata: ProfileMetadata = {
          version: MetadataVersion.ProfileMetadataVersions['1.0.0'],
          metadata_id: v4(),
          name,
          bio,
          cover_picture: avatarUrl,
          attributes
        }

        const metadataUrl = sdk?.storage.resolveScheme(
          (await upload({ data: [metadata] }))[0]
        )

        if (!metadataUrl) throw Error(e('metadata-upload-fail'))

        const typedDataResult =
          await lensClient().profile.createSetProfileMetadataTypedData({
            metadata: metadataUrl,
            profileId: currentUser?.id
          })

        const signature = await signTypedData(
          getSignature(typedDataResult.unwrap().typedData)
        )

        const broadcastResult = await lensClient().transaction.broadcast({
          id: typedDataResult.unwrap().id,
          signature: signature
        })
      }
      console.log('Profile saved successfully')
    } catch (error) {
      if (error instanceof Error) {
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onPublishClose = (shouldRefetch: boolean) => {
    setPublishModalOpen(false)

    if (shouldRefetch) {
      refetch()
    }
  }
  const onGoalClose = (shouldRefetch: boolean) => {
    setGoalModalOpen(false)

    if (shouldRefetch) {
      refetch()
    }
  }
  const onModifyClose = (shouldRefetch: boolean) => {
    setModifyModalOpen(false)

    if (shouldRefetch) {
      refetch()
    }
  }

  const onDeleteClose = (shouldRefetch: boolean) => {
    setDeleteModalOpen(false)
    if (shouldRefetch) {
      refetch()
    }
  }

  const onNew = () => {
    setPublishModalOpen(true)
  }
  const onGoalOpen = () => {
    setGoalModalOpen(true)
  }
  const onEdit = (id: string) => {
    setCurrentModifyId(id)
    setModifyModalOpen(true)
  }

  const onDelete = (id: string) => {
    setCurrentDeleteId(id)
    setDeleteModalOpen(true)
  }

  useEffect(() => {
    setPostMetadata(getCauseMetadata(data))
  }, [data])

  useEffect(() => {
    setGridTheme(
      resolvedTheme === 'light' ? 'ag-theme-alpine' : 'ag-theme-alpine-dark'
    )
  }, [resolvedTheme])
  useEffect(() => {
    if (profile) {
      const param: PublicationsQueryRequest = {
        metadata: { tags: { all: [PostTags.OrgPublish.Goal] } },
        profileId: profile.id,
        publicationTypes: [PublicationTypes.Post]
      }

      lensClient()
        .publication.fetchAll(param)
        .then((data) => {
          setVhrGoal(
            parseFloat(
              data.items[0] && isPost(data.items[0])
                ? data.items[0].metadata.attributes[0]?.value ?? '0'
                : '0'
            )
          )
        })
    }
  }, [profile])

  const { isLoading: isBalanceLoading, data: balanceData } = useWalletBalance(
    currentUser?.ownedBy ?? ''
  )

  const { data: currencyData, error: currencyError } = useEnabledCurrencies(
    currentUser?.ownedBy
  )

  useEffect(() => {
    if (currencyError) {
      toast.error(currencyError)
    }
  }, [currencyError])

  const [vhrGoal, setVhrGoal] = useState(0)

  const getFormDefaults = (id: string): IPublishCauseFormProps => {
    const d = postMetadata.find((val) => val?.id === id)

    const [country, province, city] = d?.location.split('-', 3) ?? ['', '', '']

    return d
      ? {
          name: d.name ?? '',
          goal: d.goal ?? '',
          contribution: d.contribution ?? '',
          category: d.category ?? '',
          description: d.description ?? '',
          currency: d.currency ?? '',
          recipient: d.recipient ?? '',
          imageUrl: d.imageUrl ?? '',
          country,
          province,
          city
        }
      : { ...emptyPublishFormData }
  }

  const [userId, setUserId] = useState('')
  const [userHandle, setUserHandle] = useState('')

  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <div className="p-10 m-10">
            {loading || isBalanceLoading ? (
              <Spinner />
            ) : (
              <>
                <div className="flex items-center">
                  <div className="text-3xl font-extrabold text-purple-500 dark:text-white sm:text-7xl pr-3">
                    {Number(balanceData?.value)}
                  </div>
                  <div className="text-2xl font-bold text-black dark:text-white sm:text-4xl mt-8">
                    VHR raised {vhrGoal !== 0 && `out of ${vhrGoal}`}
                  </div>
                </div>
                <Link
                  href=""
                  className="text-brand-500 hover:text-brand-600 mt-6"
                  onClick={onGoalOpen}
                  suppressHydrationWarning
                >
                  {t('set-goal')}
                </Link>

                {vhrGoal !== 0 && (
                  <Progress
                    progress={Number(balanceData?.value)}
                    total={vhrGoal}
                    className="mt-10"
                  />
                )}

                <div
                  className="text-2xl mt-10 font-bold text-black dark:text-white sm:text-4xl"
                  suppressHydrationWarning
                >
                  {t('our-cause')}
                </div>
                <div className=" w-full lg:flex mt-5">
                  <div className="border-r border-b border-l  p-5 lg:border-l-0 lg:border-t dark:border-Card bg-accent-content dark:bg-Within dark:bg-opacity-10 dark:text-sky-100 rounded-b lg:rounded-b-none lg:rounded-r  flex flex-col justify-between leading-normal w-full">
                    <form
                      className="my-5 mx-5 flex-col space-y-4"
                      onSubmit={handleSubmit}
                    >
                      <div>
                        <TextArea
                          suppressHydrationWarning
                          label={t('cause-description')}
                          id="causeDescription"
                          value={causeDescription}
                          placeholder="Description"
                          onChange={(e) => setCauseDescription(e.target.value)}
                          rows={10}
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          className="my-5"
                          disabled={isLoading}
                          icon={isLoading && <Spinner size="sm" />}
                          type="submit"
                          suppressHydrationWarning
                        >
                          Submit
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-center">
              <GridRefreshButton onClick={refetch} className="ml-auto" />
              <button
                onClick={onNew}
                className="flex items-center text-brand-400 mx-4"
              >
                <span className="mr-2 font-bold">Create New Project</span>
                <PlusCircleIcon className="w-8 text-brand-400" />
              </button>
            </div>
            <div
              className={gridTheme}
              style={{ height: '800px', width: '100%' }}
            >
              {loading ? (
                <Spinner />
              ) : (
                <AgGridReact
                  defaultColDef={defaultColumnDef}
                  rowData={postMetadata}
                  columnDefs={makeOrgCauseColumnDefs({
                    onEditClick: onEdit,
                    onDeleteClick: onDelete
                  })}
                  pagination
                  paginationPageSize={20}
                />
              )}
            </div>
            {error && <ErrorMessage message={e('generic')} />}
            <PublishCauseModal
              open={publishModalOpen}
              onClose={onPublishClose}
              publisher={profile}
              currencyData={currencyData}
            />
            <DeleteCauseModal
              open={deleteModalOpen}
              onClose={onDeleteClose}
              publisher={profile}
              id={currentDeleteId}
              postData={data}
              values={getFormDefaults(currentDeleteId)}
              currencyData={currencyData}
            />
            <ModifyCauseModal
              open={modifyModalOpen}
              onClose={onModifyClose}
              publisher={profile}
              id={currentModifyId}
              currencyData={currencyData}
              defaultValues={getFormDefaults(currentModifyId)}
            />
            <GoalModal
              open={GoalModalOpen}
              onClose={onGoalClose}
              publisher={profile}
            />
          </div>
        </Card>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default OrganizationCauses
