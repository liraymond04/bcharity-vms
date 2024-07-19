import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { PencilIcon, PlusCircleIcon } from '@heroicons/react/outline'
import { PublicationsRequest, PublicationType } from '@lens-protocol/client'
import { useSDK, useStorageUpload } from '@thirdweb-dev/react'
import { signTypedData } from '@wagmi/core'
import { AgGridReact } from 'ag-grid-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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
  checkAuth,
  getSignature,
  lensClient,
  usePostData
} from '@/lib/lens-protocol'
import {
  getOpportunityMetadata,
  isPost,
  OpportunityMetadata,
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

import DeleteOpportunityModal from '../Modals/DeleteOpportunityModal'
import ErrorComponent from '../Modals/Error'
import ModifyOpportunityModal from '../Modals/ModifyOpportunityModal'
import PublishOpportunityDraftModal from '../Modals/PublishOpportunityDraftModal'
import PublishOpportunityModal, {
  emptyPublishFormData,
  IPublishOpportunityFormProps
} from '../Modals/PublishOpportunityModal'
import VHRGoalModal from '../Modals/VHRGoalModal'
import { defaultColumnDef, makeOrgVHRColumnDefs } from './ColumnDefs'

interface OrgGridTab {
  name: string
  inactiveString: string
  filter: (data: OpportunityMetadata) => boolean
}

interface FormProps {
  causeDescription: string
}

const emptyFormProps: FormProps = {
  causeDescription: ''
}

/**
 * Component that displays the organization VHR tab page, which displays the
 * total amount of VHR displayed, a user defined goal, and a cause description.
 * Opportunity posts are fetched and displayed in an {@link https://github.com/ag-grid/ag-grid | ag-grid}
 * table.
 *
 * @remarks
 * VHR raised is fetched using the {@link useWalletBalance} hook. Organization
 * opportunity posts are fetched using the {@link usePostData} hook and the
 * metadata tag {@link PostTags.OrgPublish.Opportunity}.
 *
 * User defined goals are fetched with the {@link https://docs.lens.xyz/docs/get-publications | fetchAll publications}
 * method with the metadata tag {@link PostTags.OrgPublish.VHRGoal} and the
 * current organization's profile. The latest goal post is read to set the
 * current goal. The goal is set by creating a new publication with the new
 * goal value, and is handled by the {@link VHRGoalModal}.
 *
 * The "Our Cause" description is set as a custom attribute in the organization's
 * profile metadata, and is fetched by requesting it from Lens. It is set by
 * requesting Lens protocol to {@link https://docs.lens.xyz/docs/create-set-update-profile-metadata-typed-data | set the profile metadata}.
 *
 * Different actions are performed using different modals. Publishing new posts
 * is handled by the {@link PublishOpportunityModal}, which is opened from the
 * `Create Post` button. In the table, the edit button modifies a post using the
 * {@link ModifyOpportunityModal}, and the delete button hides a post using the
 * {@link DeleteOpportunityModal}. Draft posts are set to active by using the
 * {@link PublishOpportunityDraftModal}.
 *
 * New posts are created using the {@link usePostData} hook and passing in the
 * {@link PostTags.OrgPublish.Opportunity} metadata tag.
 */
const OrganizationVHRTab: React.FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.vhr'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const { t: v } = useTranslation('common', {
    keyPrefix: 'components.profile.volunteer'
  })
  const config = useConfig()

  const organizationGridTabs: OrgGridTab[] = [
    {
      name: t('active-posting'),
      inactiveString: t('active-inactive'),
      filter: (p) => {
        const [y, m, d] = p.endDate.split('-')
        return (
          p.type === PostTags.OrgPublish.Opportunity &&
          (!p.endDate ||
            new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).getTime() >
              new Date().getTime())
        )
      }
    },
    {
      name: t('drafts'),
      inactiveString: t('drafts-inactive'),
      filter: (p) => p.type === PostTags.OrgPublish.OpportunityDraft
    },
    {
      name: t('inactive'),
      inactiveString: t('inactive-inactive'),
      filter: (p) => {
        const [y, m, d] = p.endDate.split('-')
        return (
          p.type === PostTags.OrgPublish.Opportunity &&
          p.endDate !== '' &&
          new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).getTime() <
            new Date().getTime()
        )
      }
    }
  ]

  const { currentUser: profile } = useAppPersistStore()

  const { resolvedTheme } = useTheme()
  const [gridTheme, setGridTheme] = useState<string>()

  const { data, error, loading, refetch } = usePostData(profile?.id, {
    where: {
      metadata: {
        tags: { all: [PostTags.OrgPublish.Opportunity] }
      }
    }
  })

  const [postMetadata, setPostMetadata] = useState<OpportunityMetadata[]>([])

  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [modifyModalOpen, setModifyModalOpen] = useState(false)
  const [publishDraftModalOpen, setPublishDraftModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [GoalModalOpen, setGoalModalOpen] = useState(false)
  const [currentModifyId, setCurrentModifyId] = useState('')
  const [currentPublishDraftId, setCurrentPublishDraftId] = useState('')
  const [currentDeleteId, setCurrentDeleteId] = useState('')

  const form = useForm<FormProps>({
    defaultValues: { ...emptyFormProps }
  })

  const { handleSubmit, register } = form

  const { mutateAsync: upload } = useStorageUpload()
  const sdk = useSDK()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [location, setLocation] = useState<string>('')
  const [errora, setErrora] = useState<Error>()
  const [website, setWebsite] = useState<string>('')
  const [discord, setDiscord] = useState<string>('')
  const [twitter, setTwitter] = useState<string>('')
  const [linkedin, setLinkedin] = useState<string>('')
  const [causeDescription, setCauseDescription] = useState<string>('')
  const [cover, setCover] = useState<File | null>(null)
  const [name, setName] = useState<string>('')
  const [bio, setBio] = useState<string>('')

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [userId, setUserId] = useState('')
  const [userHandle, setUserHandle] = useState('')

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setErrora(undefined)
        if (profile) {
          setUserId(profile.id)
          setUserHandle(
            profile.handle ? profile.handle.fullHandle : 'No handle yet.'
          )

          const userProfile = await lensClient().profile.fetch({
            forProfileId: profile?.id
          })

          let user_metadata = userProfile?.metadata

          if (userProfile) {
            setName(user_metadata?.displayName ?? '')

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
  }, [profile])

  const [submitError, setSubmitError] = useState<Error>()

  const onSubmit = async (formData: FormProps) => {
    setIsLoading(true)
    setSubmitError(undefined)
    try {
      if (profile) {
        await checkAuth(profile?.ownedBy.address, profile.id)

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
            // profileId: profile?.id // deprecated
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

  const onCancel = () => {
    setShowModal(false)
    setSubmitError(undefined)
  }

  const onPublishClose = (shouldRefetch: boolean) => {
    setPublishModalOpen(false)

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

  const onPublishDraftClose = (shouldRefetch: boolean) => {
    setPublishDraftModalOpen(false)
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
  const onGoalClose = (shouldRefetch: boolean) => {
    setGoalModalOpen(false)

    if (shouldRefetch) {
      refetch()
    }
  }
  const onGoalOpen = () => {
    setGoalModalOpen(true)
  }
  const onNew = () => {
    setPublishModalOpen(true)
  }

  const onEdit = (id: string) => {
    setCurrentModifyId(id)
    setModifyModalOpen(true)
  }

  const onPublishDraft = (id: string) => {
    setCurrentPublishDraftId(id)
    setPublishDraftModalOpen(true)
  }

  const onDelete = (id: string) => {
    setCurrentDeleteId(id)
    setDeleteModalOpen(true)
  }

  useEffect(() => {
    setGridTheme(
      resolvedTheme === 'light' ? 'ag-theme-alpine' : 'ag-theme-alpine-dark'
    )
  }, [resolvedTheme])
  useEffect(() => {
    if (profile) {
      const param: PublicationsRequest = {
        where: {
          metadata: { tags: { all: [PostTags.OrgPublish.VHRGoal] } },
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
  useEffect(() => {
    setPostMetadata(getOpportunityMetadata(data))
  }, [data])

  const getFormDefaults = (id: string): IPublishOpportunityFormProps => {
    const d = postMetadata.find((val) => val?.id === id)

    return d
      ? {
          name: d.name ?? '',
          startDate: d.startDate ?? '',
          endDate: d.endDate ?? '',
          hoursPerWeek: d.hoursPerWeek ?? '',
          category: d.category ?? '',
          website: d.website ?? '',
          description: d.description ?? '',
          imageUrl: d.imageUrl ?? '',
          applicationRequired: d.applicationRequired ?? ''
        }
      : { ...emptyPublishFormData }
  }

  const [vhrGoal, setVhrGoal] = useState(0)

  const { isLoading: isBalanceLoading, data: balanceData } = useWalletBalance(
    profile?.ownedBy.address ?? ''
  )

  const getHeight = () => {
    const data = postMetadata.filter(
      organizationGridTabs[selectedTabIndex].filter
    )

    if (data.length === 0) return '200px'
    else return '800px'
  }

  const getDisplayedGrid = () => {
    if (loading) return <Spinner />

    const data = postMetadata.filter(
      organizationGridTabs[selectedTabIndex].filter
    )

    if (data.length === 0)
      return (
        <div className="h-full w-full flex items-center justify-center">
          <p className="font-semibold text-center text-xl px-4 py-3 bg-zinc-200 dark:bg-purple-900 text-brand-500 dark:text-brand-200 shadow-sm shadow-zinc-400 dark:shadow-none">
            {organizationGridTabs[selectedTabIndex].inactiveString}
          </p>
        </div>
      )

    return (
      <AgGridReact
        defaultColDef={defaultColumnDef}
        rowData={data}
        columnDefs={makeOrgVHRColumnDefs({
          onPublishNowClick:
            organizationGridTabs[selectedTabIndex].name === t('drafts')
              ? onPublishDraft
              : undefined,
          onEditClick: onEdit,
          onDeleteClick: onDelete
        })}
        pagination
        paginationPageSize={20}
      />
    )
  }

  return (
    <GridLayout>
      <GridItemTwelve>
        <Card>
          <div className="p-10 m-10">
            {isBalanceLoading ? (
              <Spinner />
            ) : (
              <>
                <div className="flex items-center">
                  <div className="text-3xl font-extrabold text-purple-500 dark:text-white sm:text-7xl pl-10 pr-3">
                    {Number(balanceData?.value)}
                  </div>
                  <div className="text-2xl font-bold text-black dark:text-white sm:text-4xl mt-8">
                    {v('raised')} {vhrGoal !== 0 && `out of ${vhrGoal}`}
                  </div>
                </div>
                <Link
                  href=""
                  className="text-brand-500 hover:text-brand-600 mt-6 ml-10"
                  onClick={onGoalOpen}
                  suppressHydrationWarning
                >
                  {t('set-goal')}
                </Link>
                {vhrGoal !== 0 && (
                  <Progress
                    progress={Number(balanceData?.value)}
                    total={vhrGoal}
                    className="mt-10 mb-10"
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
                        <ErrorComponent
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

          <div className="px-5">
            <div className="flex items-center">
              {organizationGridTabs.map((v, i) => {
                return (
                  <p
                    key={i}
                    onClick={() => setSelectedTabIndex(i)}
                    className={`px-3 cursor-pointer border border-zinc-400 ${
                      selectedTabIndex === i
                        ? 'bg-zinc-300 dark:bg-brand-600'
                        : 'bg-white dark:bg-brand-400'
                    }`}
                  >
                    {v.name}
                  </p>
                )
              })}
              <GridRefreshButton onClick={refetch} className="ml-auto" />
              <button
                onClick={onNew}
                className="flex items-center text-brand-400 mx-4"
              >
                <span className="mr-2 mt-1 font-bold">{t('create-new')}</span>
                <PlusCircleIcon className="w-8 text-brand-400" />
              </button>
            </div>
            <div
              className={gridTheme}
              style={{ height: getHeight(), width: '100%' }}
            >
              {getDisplayedGrid()}
            </div>
            {error && <ErrorComponent message={e('generic')} />}
          </div>
          <PublishOpportunityModal
            open={publishModalOpen}
            onClose={onPublishClose}
            publisher={profile}
          />
          <ModifyOpportunityModal
            open={modifyModalOpen}
            onClose={onModifyClose}
            publisher={profile}
            id={currentModifyId}
            isDraft={
              organizationGridTabs[selectedTabIndex].name === t('drafts')
            }
            defaultValues={getFormDefaults(currentModifyId)}
          />
          <PublishOpportunityDraftModal
            open={publishDraftModalOpen}
            onClose={onPublishDraftClose}
            publisher={profile}
            id={currentPublishDraftId}
            values={getFormDefaults(currentPublishDraftId)}
          />
          <DeleteOpportunityModal
            open={deleteModalOpen}
            onClose={onDeleteClose}
            publisher={profile}
            id={currentDeleteId}
            postData={data}
            values={getFormDefaults(currentDeleteId)}
          />
          <VHRGoalModal
            open={GoalModalOpen}
            onClose={onGoalClose}
            publisher={profile}
          />
        </Card>
      </GridItemTwelve>
    </GridLayout>
  )
}

export default OrganizationVHRTab
