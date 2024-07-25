import { ProfileFragment as Profile } from '@lens-protocol/client'
import { useStorageUpload } from '@thirdweb-dev/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 } from 'uuid'

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
import Error from './Error'

/**
 * Properties of a publish opportunity form
 */
export interface IPublishOpportunityFormProps {
  /**
   * The opportunity name
   */
  name: string
  /**
   * The opportunity start date in YYYY-MM-DD format
   */
  startDate: string
  /**
   * The opportunity end date in YYYY-MM-DD format
   */
  endDate: string
  /**
   * The number of hours per week for this volunteer opportunity
   */
  hoursPerWeek: string
  /**
   * The category associated with the volunteer opportunity
   */
  category: string
  /**
   * An optional url to link to an external webste
   */
  website: string
  /**
   * The opportunity description
   */
  description: string
  /**
   * An optional URL to image uploaded to IPFS. Empty string if no image
   */
  imageUrl: string
  /**
   * Whether or not applications are required for this volunteer opportunity
   */
  applicationRequired: boolean
}

export const emptyPublishFormData: IPublishOpportunityFormProps = {
  name: '',
  startDate: '',
  endDate: '',
  hoursPerWeek: '',
  category: '',
  website: '',
  description: '',
  imageUrl: '',
  applicationRequired: false
}

/**
 * Properties of {@link PublishOpportunityModal}
 */
export interface IPublishOpportunityModalProps {
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
   * Lens profile fragment of the publisher of the post
   */
  publisher: Profile | null
}

/**
 * Component that displays a popup modal for publishing a volunteer opportunity post, wraps a {@link GradientModal}.
 *
 * Because publications are immutable in Lens, cause posts are modified by using a separately
 * generated UUID for a publication. The new UUID is generated when the original publication is
 * published, and passed to its modified posts. Modified posts are new Lens publications, but
 * the passed down UUID is used to hide older posts with the same UUID, and only display its
 * latest version.
 *
 * Drafts are published by copying its contents into a new Lens publication, but with its
 * attribute isDraft set to false. Similarly to modifying posts, the original unique UUID is
 * passed down and publishing a draft post will hide its draft publication since it is no longer
 * the latest version of the original post.
 *
 * Used in {@link components.Dashboard.OrganizationDashboard.OrganizationVHR}
 */
const PublishOpportunityModal: React.FC<IPublishOpportunityModalProps> = ({
  open,
  onClose,
  publisher
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.modals.publish-opportunity'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const { createPost } = useCreatePost()

  const { mutateAsync: upload } = useStorageUpload()

  const [endDateDisabled, setEndDateDisabled] = useState<boolean>(true)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)
  const [isChecked, setIsChecked] = useState(false)
  const form = useForm<IPublishOpportunityFormProps>()

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

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  const onCancel = () => {
    clearErrors()
    reset()
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
      const imageUrl = image ? (await upload({ data: [image] }))[0] : ''

      const publishTag = isChecked
        ? PostTags.OrgPublish.Opportunity
        : PostTags.OrgPublish.OpportunityDraft

      const { applicationRequired, ...rest } = formData
      const metadata = buildMetadata<OpportunityMetadataRecord>(
        publisher,
        [publishTag],
        {
          version: MetadataVersion.OpportunityMetadataVersion['1.0.2'],
          type: publishTag,
          id: v4(),
          ...rest,
          applicationRequired: applicationRequired ? 'true' : 'false',
          imageUrl
        }
      )

      await checkAuth(publisher.ownedBy.address, publisher.id)
      await createPost({
        profileId: publisher.id,
        metadata
      })

      reset()
      onClose(true)
    } catch (e: any) {
      setErrorMessage(e.message)
      setError(true)
    }
    setIsPending(false)
  }

  const currentDay = getFormattedDate(new Date().toISOString())

  const [minDate, setMinDate] = useState<string>(currentDay)

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
              disabled={!endDateDisabled}
              min={minDate}
              error={!!errors.endDate?.type}
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
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  style={{
                    appearance: 'none',
                    backgroundColor: isChecked ? 'purple' : 'transparent',
                    border: '1px solid grey',
                    width: '25px',
                    height: '25px'
                  }}
                />
                <span style={{ marginLeft: '12px' }} suppressHydrationWarning>
                  {t('publish-now')}
                </span>
              </label>
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
              label={t('image')}
              accept="image/*"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0]
                setError(false)

                if (selectedFile && validImageExtension(selectedFile.name)) {
                  setImage(selectedFile)
                } else {
                  setError(true)
                  setErrorMessage(e('invalid-file-format'))
                }
              }}
            />
          </Form>
        ) : (
          <Spinner />
        )}

        {error && (
          <Error
            message={`${e('generic-front')}${errorMessage}${e('generic-back')}`}
          />
        )}
      </div>
    </GradientModal>
  )
}

export default PublishOpportunityModal
