import { PlusCircleIcon } from '@heroicons/react/outline'
import { PencilIcon } from '@heroicons/react/solid'
import { PublicationsRequest, PublicationType } from '@lens-protocol/client'
import { useSDK, useStorageUpload } from '@thirdweb-dev/react'
import { signTypedData } from '@wagmi/core'
import { AgGridReact } from 'ag-grid-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { v4 } from 'uuid'
import { useConfig } from 'wagmi'

import { GridItemTwelve, GridLayout } from '@/components/GridLayout'
import GridRefreshButton from '@/components/Shared/GridRefreshButton'
import Progress from '@/components/Shared/Progress'
import { Button } from '@/components/UI/Button'
import { Card } from '@/components/UI/Card'
import { Form } from '@/components/UI/Form'
import { Modal } from '@/components/UI/Modal'
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

interface FormProps {
  causeDescription: string
}

const emptyFormProps: FormProps = {
  causeDescription: ''
}

/**
 * Component that displays the organization VHR tab page, which displays the
 * total amount of VHR displayed, a user defined goal, and a cause description.
 * Cause posts are fetched and displayed in an {@link https://github.com/ag-grid/ag-grid | ag-grid}
 * table.
 *
 * @remarks
 * VHR raised is fetched using the {@link useWalletBalance} hook. Organization
 * cause posts are fetched using the {@link usePostData} hook and the metadata
 * tag {@link PostTags.OrgPublish.Cause}.
 *
 * User defined goals are fetched with the {@link https://docs.lens.xyz/docs/get-publications | fetchAll publications}
 * method with the metadata tag {@link PostTags.OrgPublish.Goal} and the
 * current organization's profile. The latest goal post is read to set the
 * current goal. The goal is set by creating a new publication with the new
 * goal value, and is handled by the {@link components.Dashboard.Modals.VHRGoalModal}.
 *
 * The "Our Cause" description is set as a custom attribute in the organization's
 * profile metadata, and is fetched by requesting it from Lens. It is set by
 * requesting Lens protocol to {@link https://docs.lens.xyz/docs/create-set-update-profile-metadata-typed-data | set the profile metadata}.
 *
 * Different actions are performed using different modals. Publishing new posts
 * is handled by the {@link PublishCauseModal}, which is opened from the
 * `Create Post` button. In the table, the edit button modifies a post using the
 * {@link ModifyCauseModal}, and the delete button hides a post using the
 * {@link DeleteCauseModal}.
 *
 * New posts are created using the {@link usePostData} hook and passing in the
 * {@link PostTags.OrgPublish.Cause} metadata tag.
 */
const OrganizationCauses: React.FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.causes'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const { t: v } = useTranslation('common', {
    keyPrefix: 'components.profile.volunteer'
  })
  const config = useConfig()

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
    where: {
      metadata: {
        tags: { all: [PostTags.OrgPublish.Cause] }
      }
    }
  })

  const [showModal, setShowModal] = useState<boolean>(false)
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

  const form = useForm<FormProps>({
    defaultValues: { ...emptyFormProps }
  })

  const { handleSubmit, register } = form

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setErrora(undefined)
        if (currentUser) {
          setUserId(currentUser.id)
          setUserHandle(
            currentUser.handle ? currentUser.handle.fullHandle : 'No handle yet'
          )

          const userProfile = await lensClient().profile.fetch({
            forProfileId: currentUser?.id
          })

          if (userProfile) {
            setName(userProfile.metadata?.displayName || '')

            if (userProfile.metadata?.attributes) {
              const locationAttribute = userProfile.metadata?.attributes.find(
                (attr) => attr.key === 'location'
              )
              setLocation(locationAttribute?.value || '')
              const websiteAttribute = userProfile.metadata?.attributes.find(
                (attr) => attr.key === 'website'
              )
              setWebsite(websiteAttribute?.value || '')
              const discordAttribute = userProfile.metadata?.attributes.find(
                (attr) => attr.key === 'discord'
              )
              setDiscord(discordAttribute?.value || '')
              const twitterAttribute = userProfile.metadata?.attributes.find(
                (attr) => attr.key === 'twitter'
              )
              setTwitter(twitterAttribute?.value || '')
              const linkedinAttribute = userProfile.metadata?.attributes.find(
                (attr) => attr.key === 'linkedin'
              )
              setLinkedin(linkedinAttribute?.value || '')
              const causeDescriptionAttribute =
                userProfile.metadata?.attributes.find(
                  (attr) => attr.key === 'causeDescription'
                )
              setCauseDescription(causeDescriptionAttribute?.value || '')
              form.setValue(
                'causeDescription',
                causeDescriptionAttribute?.value ?? ''
              )
              console.log('descripton', causeDescriptionAttribute)
            }
            setBio(userProfile.metadata?.bio || '')
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

  const [submitError, setSubmitError] = useState<Error>()

  const onSubmit = async (formData: FormProps) => {
    setIsLoading(true)
    setSubmitError(undefined)
    try {
      if (currentUser) {
        await checkAuth(currentUser?.ownedBy.address, currentUser.id)

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
            value: formData.causeDescription,
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
            metadataURI: metadataUrl
            // profileId: currentUser?.id // doesn't exist in the request object anymore
          })

        const signature = await signTypedData(
          config,
          getSignature(typedDataResult.unwrap().typedData)
        )

        const broadcastResult = await lensClient().transaction.broadcastOnchain(
          {
            id: typedDataResult.unwrap().id,
            signature: signature
          }
        )
      }
      setCauseDescription(formData.causeDescription)
      setShowModal(false)
      console.log('Profile saved successfully')
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error)
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
      const param: PublicationsRequest = {
        where: {
          metadata: { tags: { all: [PostTags.OrgPublish.Goal] } },
          actedBy: profile.id,
          publicationTypes: [PublicationType.Post]
        }
      }

      lensClient()
        .publication.fetchAll(param)
        .then((data) => {
          setVhrGoal(
            parseFloat(
              data.items[0] && isPost(data.items[0])
                ? data.items[0].metadata
                  ? data.items[0].metadata.attributes
                    ? data.items[0].metadata.attributes[0]?.value
                    : '0'
                  : '0'
                : '0'
            )
          )
        })
    }
  }, [profile])

  const { isLoading: isBalanceLoading, data: balanceData } = useWalletBalance(
    currentUser?.ownedBy.address ?? ''
  )

  const { data: currencyData, error: currencyError } = useEnabledCurrencies(
    currentUser?.ownedBy.address
  )

  const onCancel = () => {
    setShowModal(false)
    setSubmitError(undefined)
  }

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
                    {v('raised')} {vhrGoal !== 0 && `out of ${vhrGoal}`}
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
                  className="text-2xl mt-10 font-bold sm:text-4xl"
                  suppressHydrationWarning
                >
                  {t('our-cause')}
                </div>
                <Button
                  icon={<PencilIcon className="w-5 h-5" />}
                  onClick={() => {
                    setShowModal(true)
                  }}
                  suppressHydrationWarning
                >
                  {t('cause-edit')}
                </Button>
                <Modal
                  show={showModal}
                  onClose={onCancel}
                  title={t('cause-description')}
                >
                  <Form
                    form={form}
                    onSubmit={() => handleSubmit((data) => onSubmit(data))}
                  >
                    <div className="mx-5 my-3 ">
                      <div className="w-auto h-auto ">
                        <TextArea
                          suppressHydrationWarning
                          label={t('cause-description')}
                          id="causeDescription"
                          defaultValue={causeDescription}
                          placeholder={t('description-placeholder')}
                          rows={10}
                          {...register('causeDescription')}
                        />
                      </div>
                      {submitError && (
                        <ErrorMessage
                          message={`${e('generic-front')}${
                            submitError.message
                          }${e('generic-back')}`}
                        />
                      )}
                    </div>
                    <div className="custom-divider" />
                    <div className="flex justify-between">
                      <Button
                        onClick={handleSubmit((data) => onSubmit(data))}
                        className="bg-purple-500 my-3 ml-5"
                        icon={isLoading && <Spinner size="sm" />}
                        disabled={isLoading}
                        suppressHydrationWarning
                        type="submit"
                      >
                        {t('submit')}
                      </Button>
                      <Button
                        onClick={onCancel}
                        className="bg-gray-400 hover:bg-gray-500 my-3 mr-5"
                        suppressHydrationWarning
                        type="button"
                      >
                        {t('cancel')}
                      </Button>
                    </div>
                  </Form>
                </Modal>
                <div className=" w-full lg:flex mt-2">
                  <div
                    className="border-r border-b border-l p-5 lg:border-l-0 lg:border-t dark:border-Card bg-accent-content dark:bg-Within dark:bg-opacity-10 dark:text-sky-100 rounded-b lg:rounded-b-none lg:rounded-r  flex flex-col justify-between leading-normal w-full"
                    suppressHydrationWarning
                  >
                    {causeDescription ? causeDescription : t('no-description')}
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
                <span className="mr-2 font-bold" suppressHydrationWarning>
                  {t('create-new')}
                </span>
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
              currencyData={currencyData?.items}
            />
            <DeleteCauseModal
              open={deleteModalOpen}
              onClose={onDeleteClose}
              publisher={profile}
              id={currentDeleteId}
              postData={data}
              values={getFormDefaults(currentDeleteId)}
              currencyData={currencyData?.items}
            />
            <ModifyCauseModal
              open={modifyModalOpen}
              onClose={onModifyClose}
              publisher={profile}
              id={currentModifyId}
              currencyData={currencyData?.items}
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
