import { ProfileFragment } from '@lens-protocol/client'
import { useStorageUpload } from '@thirdweb-dev/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { FileInput } from '@/components/UI/FileInput'
import { Form } from '@/components/UI/Form'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import { checkAuth, useCreatePost } from '@/lib/lens-protocol'
import {
  buildMetadata,
  OpportunityMetadataRecord,
  PostTags
} from '@/lib/metadata'
import { MetadataVersion } from '@/lib/types'
import validImageExtension from '@/lib/validImageExtension'

import { getFormattedDate } from '../OrganizationDashboard/OrganizationManagement/VolunteerManagement'
import ErrorComponent from './Error'
import { IPublishOpportunityFormProps } from './PublishOpportunityModal'

/**
 * Properties of {@link ModifyOpportunityModal}
 */
export interface IModifyOpportunityModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean
  /**
   * Function to run when the modal is closed
   * @returns
   */
  onClose: (shouldRefetch: boolean) => void
  /**
   * Post ID of the post being deleted
   */
  id: string
  /**
   * Lens profile fragment of the publisher of the post
   */
  publisher: ProfileFragment | null
  /**
   * Whether the opportunity post is a draft
   */
  isDraft: boolean
  /**
   * Default post values displayed in the form
   */
  defaultValues: IPublishOpportunityFormProps
}

/**
 * Component that displays a popup modal for modifying a volunteer opportunity post, wraps a {@link GradientModal}.
 *
 * Because publications are immutable in Lens, cause posts are modified by using a separately
 * generated UUID for a publication. The new UUID is generated when the original publication is
 * published, and passed to its modified posts. Modified posts are new Lens publications, but
 * the passed down UUID is used to hide older posts with the same UUID, and only display its
 * latest version.
 *
 * Used in {@link components.Dashboard.OrganizationDashboard.OrganizationVHR}
 */
const ModifyOpportunityModal: React.FC<IModifyOpportunityModalProps> = ({
  open,
  onClose,
  id,
  publisher,
  isDraft,
  defaultValues
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.modals.modify-opportunity'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const { createPost } = useCreatePost()

  const { mutateAsync: upload } = useStorageUpload()

  const [isPending, setIsPending] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)
  const [endDateDisabled, setEndDateDisabled] = useState<boolean>(true)
  const form = useForm<IPublishOpportunityFormProps>({ defaultValues })
  const [ongoing, setOngoing] = useState<boolean>(false)

  useEffect(() => {
    reset(defaultValues)
    if (defaultValues.endDate === '') {
      setOngoing(true)
    }
  }, [defaultValues])

  const {
    handleSubmit,
    reset,
    resetField,
    register,
    clearErrors,
    watch,
    formState: { errors }
  } = form

  const currentFormData = watch()

  const validUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  const onCancel = () => {
    clearErrors()
    reset(defaultValues)
    setError(false)
    setErrorMessage('')
    onClose(false)
  }

  const onSubmit = async (formData: IPublishOpportunityFormProps) => {
    setError(false)
    setIsPending(true)

    if (!publisher) {
      setErrorMessage(e('profile-null'))
      setError(true)
      setIsPending(false)
      return
    }

    try {
      const imageUrl = image
        ? (await upload({ data: [image] }))[0]
        : defaultValues.imageUrl

      const { applicationRequired, ...rest } = formData

      const publishTag = !isDraft
        ? PostTags.OrgPublish.Opportunity
        : PostTags.OrgPublish.OpportunityDraft

      const metadata = buildMetadata<OpportunityMetadataRecord>(
        publisher,
        [publishTag],
        {
          version: MetadataVersion.OpportunityMetadataVersion['1.0.2'],
          type: publishTag,
          id,
          ...rest,
          applicationRequired: applicationRequired ? 'true' : 'false',
          imageUrl
        }
      )

      await checkAuth(publisher.ownedBy.address)
      await createPost({
        profileId: publisher.id,
        metadata
      })

      reset()
      onClose(true)
    } catch (e: any) {
      setError(true)
      if (e instanceof Error) {
        setErrorMessage(e.message)
      } else {
        console.error(e)
      }
    }
    setIsPending(false)
  }

  const currentDay = getFormattedDate(new Date().toISOString())

  const [minDate, setMinDate] = useState<string>(
    new Date().toLocaleDateString()
  )

  return (
    <GradientModal
      title={t('title')}
      open={open}
      onCancel={onCancel}
      onSubmit={handleSubmit((data) => onSubmit(data))}
      submitDisabled={isPending}
    >
      <div className="mx-12">
        {!isPending ? (
          <Form
            form={form}
            onSubmit={() => handleSubmit((data) => onSubmit(data))}
          >
            <Input
              suppressHydrationWarning
              label={t('name')}
              placeholder={t('name-placeholder')}
              error={!!errors.name?.type}
              {...register('name', {
                required: true,
                maxLength: 100
              })}
            />

            <Input
              label={t('start-date')}
              type="date"
              placeholder="yyyy-mm-dd"
              min={currentDay}
              error={!!errors.startDate?.type}
              {...register('startDate', {
                required: true
              })}
              onChange={(e) => {
                if (
                  Date.parse(form.getValues('endDate')) <
                  Date.parse(e.target.value)
                ) {
                  resetField('endDate')
                }
                setMinDate(e.target.value)
              }}
            />
            <Input
              label={t('end-date')}
              type="endDate"
              placeholder="yyyy-mm-dd"
              // disabled={!endDateDisabled}
              min={minDate}
              error={!!errors.endDate?.type}
              defaultValue={ongoing.toString()}
              {...register('endDate', {})}
              onChange={(e) => {
                if (e.target.value === 'on') {
                  resetField('endDate')
                  setEndDateDisabled(!endDateDisabled)
                }
              }}
            />
            <Input
              label={t('hours')}
              placeholder="5.5"
              error={!!errors.hoursPerWeek?.type}
              {...register('hoursPerWeek', {
                required: true,
                pattern: {
                  value: /^(?!0*[.,]0*$|[.,]0*$|0*$)\d+[,.]?\d{0,1}$/,
                  message: t('hours-invalid')
                }
              })}
            />
            <Input
              suppressHydrationWarning
              label={t('category')}
              placeholder={t('category-placeholder')}
              error={!!errors.category?.type}
              {...register('category', { required: true, maxLength: 40 })}
            />
            <Input
              label={t('website')}
              placeholder="https://ecssen.ca/opportunity-link"
              error={!!errors.website?.type}
              {...register('website', {
                validate: (url) => {
                  return url == '' || validUrl(url) || t('website-invalid')
                }
              })}
            />
            <TextArea
              label={t('description')}
              placeholder={t('description-placeholder')}
              error={!!errors.description?.type}
              {...register('description', { required: true, maxLength: 250 })}
            />
            <div className="flex-row space-x-96">
              <label
                style={{
                  display: 'inline-block',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '15px',
                  marginBottom: '15px'
                }}
              >
                <input
                  type="checkbox"
                  {...register('applicationRequired')}
                  style={{
                    appearance: 'none',
                    backgroundColor: currentFormData.applicationRequired
                      ? 'purple'
                      : 'transparent',
                    border: '1px solid grey',
                    width: '25px',
                    height: '25px'
                  }}
                />
                <span style={{ marginLeft: '12px' }} suppressHydrationWarning>
                  {t('registration-required')}
                </span>
              </label>
            </div>
            <FileInput
              defaultImageIPFS={defaultValues.imageUrl ?? ''}
              label={t('image')}
              accept="image/*"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0]
                setError(false)

                if (selectedFile && validImageExtension(selectedFile.name)) {
                  setImage(selectedFile)
                } else {
                  setError(true)
                  setErrorMessage(e('invalid-file-type'))
                }
              }}
            />
          </Form>
        ) : (
          <Spinner />
        )}

        {error && (
          <ErrorComponent
            message={`${e('generic-front')}${errorMessage}${e('generic-back')}`}
          />
        )}
      </div>
    </GradientModal>
  )
}

export default ModifyOpportunityModal
