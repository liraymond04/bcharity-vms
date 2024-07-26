import { ProfileFragment as Profile } from '@lens-protocol/client'
import { Erc20Fragment } from '@lens-protocol/client'
import { useStorageUpload } from '@thirdweb-dev/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { v4 } from 'uuid'

import FormDropdown from '@/components/Shared/FormDropdown'
import GradientModal from '@/components/Shared/Modal/GradientModal'
import { FileInput } from '@/components/UI/FileInput'
import { Form } from '@/components/UI/Form'
import { Input } from '@/components/UI/Input'
import LocationFormComponent from '@/components/UI/LocationDropdowns'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import { DEFAULT_COLLECT_TOKEN } from '@/constants'
import getTokenImage from '@/lib/getTokenImage'
import { checkAuth, useCreatePost } from '@/lib/lens-protocol'
import { buildMetadata, CauseMetadataRecord, PostTags } from '@/lib/metadata'
import { MetadataVersion } from '@/lib/types'
import validImageExtension from '@/lib/validImageExtension'

import ErrorComponent from './Error'

/**
 * Properties of a publish cause form
 */
export interface IPublishCauseFormProps {
  /**
   * TODO
   */
  currency: string
  /**
   * The cause name
   */
  name: string
  /**
   * The category associated with the cause
   */
  category: string
  /**
   * TODO
   */
  contribution: string
  /**
   * TODO
   */
  goal: string
  /**
   * TODO
   */
  recipient: string
  /**
   * description for this project
   */
  description: string
  /**
   * An optional URL to image uploaded to IPFS. Empty string if no image
   */
  imageUrl: string
  /**
   * The country of the cause location
   */
  country: string
  /**
   * The province of the cause location
   */
  province: string
  /**
   * The city of the cause location
   */
  city: string
}

export const emptyPublishFormData: IPublishCauseFormProps = {
  name: '',
  category: '',
  currency: DEFAULT_COLLECT_TOKEN,
  contribution: '',
  goal: '',
  recipient: '',
  description: '',
  imageUrl: '',
  country: '',
  province: '',
  city: ''
}

/**
 * Properties of {@link PublishCauseModal}
 */
export interface IPublishCauseModalProps {
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
  /**
   * Information about the token used in the cause post
   */
  currencyData: Erc20Fragment[] | undefined
}

/**
 * Component that displays a popup modal for publishing a cause post, wraps a {@link GradientModal}.
 *
 * Because publications are immutable in Lens, cause posts are modified by using a separately
 * generated UUID for a publication. The new UUID is generated when the original publication is
 * published, and passed to its modified posts. Modified posts are new Lens publications, but
 * the passed down UUID is used to hide older posts with the same UUID, and only display its
 * latest version.
 *
 * Used in {@link components.Dashboard.OrganizationDashboard.OrganizationCauses}
 */
const PublishCauseModal: React.FC<IPublishCauseModalProps> = ({
  open,
  onClose,
  publisher,
  currencyData
}) => {
  const { createPost } = useCreatePost()

  const { mutateAsync: upload } = useStorageUpload()

  const form = useForm<IPublishCauseFormProps>({
    defaultValues: { ...emptyPublishFormData }
  })

  const {
    handleSubmit,
    reset,
    register,
    watch,
    clearErrors,
    formState: { errors }
  } = form

  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.modals.publish-cause'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const [isPending, setIsPending] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)

  const currency = watch('currency')

  const [selectedCurrencySymbol, setSelectedCurrencySymol] = useState('WMATIC')

  useEffect(() => {
    reset({ ...emptyPublishFormData })
  }, [reset])

  useEffect(() => {
    setSelectedCurrencySymol(
      currencyData?.find((c) => c.name === currency)?.symbol ?? 'WMATIC'
    )
  }, [currency, currencyData])

  const onCancel = () => {
    clearErrors()
    reset()
    setError(false)
    setErrorMessage('')
    onClose(false)
  }

  const onSubmit = async (formData: IPublishCauseFormProps) => {
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

      const metadata = buildMetadata<CauseMetadataRecord>(
        publisher,
        [PostTags.OrgPublish.Cause],
        {
          version: MetadataVersion.OpportunityMetadataVersion['1.0.1'],
          type: PostTags.OrgPublish.Cause,
          id: v4(),
          name: formData.name,
          category: formData.category,
          currency: formData.currency,
          contribution: formData.contribution,
          goal: formData.goal,
          recipient: formData.recipient,
          description: formData.description,
          location: `${formData.country}-${formData.province}-${formData.city}`,
          imageUrl
        }
      )

      const collectModuleParams = {
        feeCollectModule: {
          amount: {
            currency,
            value: formData.contribution
          },
          recipient: formData.recipient,
          referralFee: 0,
          followerOnly: false
        }
      }

      await checkAuth(publisher.ownedBy.address, publisher.id)
      await createPost({
        profileId: publisher.id,
        metadata
        // collectModule: collectModuleParams
        // in lensProtocol/useCreatePost.ts there is only 2 params (profleId and metadata) ~ line 14
      })

      reset()
      onClose(true)
    } catch (e) {
      setError(true)
      if (e instanceof Error) {
        setErrorMessage(e.message)
      } else {
        console.error(e)
      }
    }
    setIsPending(false)
  }

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
                maxLength: 255
              })}
            />
            <Input
              suppressHydrationWarning
              label={t('category')}
              placeholder={t('category-placeholder')}
              error={!!errors.category?.type}
              {...register('category', {
                required: true,
                maxLength: 40
              })}
            />
            <FormDropdown
              label={t('selected-currency')}
              options={Array.from(
                new Set(currencyData?.map((c) => c.name) ?? [])
              )}
              displayedOptions={Array.from(
                new Set(currencyData?.map((c) => c.name) ?? [])
              )}
              {...register('currency')}
            />

            <LocationFormComponent />
            <Input
              label={t('contribution')}
              type="number"
              step="0.0001"
              min="0"
              max="100000"
              prefix={
                <img
                  className="w-6 h-6"
                  height={24}
                  width={24}
                  src={getTokenImage(selectedCurrencySymbol)}
                  alt={selectedCurrencySymbol}
                />
              }
              placeholder="5"
              {...register('contribution', {
                required: true,
                maxLength: 12,
                min: {
                  value: 1,
                  message: t('contribution-invalid')
                }
              })}
            />
            <Input
              label={t('goal')}
              type="number"
              step="0.0001"
              min="0"
              max="100000"
              prefix={
                <img
                  className="w-6 h-6"
                  height={24}
                  width={24}
                  src={getTokenImage(selectedCurrencySymbol)}
                  alt={selectedCurrencySymbol}
                />
              }
              placeholder="400"
              {...register('goal', { required: true, maxLength: 12 })}
            />
            <Input
              label={t('recipient')}
              type="text"
              placeholder="0x3A5bd...5e3"
              {...register('recipient', {
                required: true,
                pattern: {
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: t('recipient-invalid')
                }
              })}
            />
            <TextArea
              suppressHydrationWarning
              label={t('description')}
              placeholder={t('description-placeholder')}
              error={!!errors.description?.type}
              {...register('description', { required: true, maxLength: 1000 })}
            />
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

export default PublishCauseModal
