import { ProfileFragment as Profile } from '@lens-protocol/client'
import { Erc20Fragment } from '@lens-protocol/client'
import { useStorageUpload } from '@thirdweb-dev/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import FormDropdown from '@/components/Shared/FormDropdown'
import GradientModal from '@/components/Shared/Modal/GradientModal'
import { FileInput } from '@/components/UI/FileInput'
import { Form } from '@/components/UI/Form'
import { Input } from '@/components/UI/Input'
import LocationFormComponent from '@/components/UI/LocationDropdowns'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import getTokenImage from '@/lib/getTokenImage'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import useCreatePost from '@/lib/lens-protocol/useCreatePost'
import { buildMetadata, CauseMetadataRecord } from '@/lib/metadata'
import { PostTags } from '@/lib/metadata'
import { MetadataVersion } from '@/lib/types'

import Error from './Error'
import { IPublishCauseFormProps } from './PublishCauseModal'

interface IPublishCauseModalProps {
  open: boolean
  onClose: (shouldRefetch: boolean) => void
  id: string
  publisher: Profile | null
  defaultValues: IPublishCauseFormProps
  currencyData: Erc20Fragment[] | undefined
}

const ModifyCauseModal: React.FC<IPublishCauseModalProps> = ({
  open,
  onClose,
  id,
  publisher,
  defaultValues,
  currencyData
}) => {
  const { createPost } = useCreatePost()

  const form = useForm<IPublishCauseFormProps>({ defaultValues })

  const {
    handleSubmit,
    reset,
    register,
    watch,
    clearErrors,
    formState: { errors }
  } = form

  const { mutateAsync: upload } = useStorageUpload()

  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.modals.modify-cause'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const [isPending, setIsPending] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)

  const currency = watch('currency')

  const [selectedCurrencySymbol, setSelectedCurrencySymol] = useState('WMATIC')

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  useEffect(() => {
    setSelectedCurrencySymol(
      currencyData?.find((c) => c.address === currency)?.symbol ?? 'WMATIC'
    )
  }, [currency, currencyData])

  const onCancel = () => {
    clearErrors()
    reset(defaultValues)
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
      const imageUrl = image
        ? (await upload({ data: [image] }))[0]
        : defaultValues.imageUrl

      const metadata = buildMetadata<CauseMetadataRecord>(
        publisher,
        [PostTags.OrgPublish.Opportunity],
        {
          version: MetadataVersion.CauseMetadataVersion['1.0.1'],
          type: PostTags.OrgPublish.Cause,
          id,
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

      await checkAuth(publisher.ownedBy)

      const createPostResult = await createPost({
        profileId: publisher.id,
        metadata,
        collectModule: collectModuleParams
      })

      if (createPostResult.isFailure()) {
        setError(true)
        setErrorMessage(createPostResult.error.message)
        throw createPostResult.error.message
      }

      reset(formData)
      onClose(true)
    } catch (e: any) {
      setErrorMessage(e.message)
      setError(true)
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
              options={currencyData?.map((c) => c.address) ?? []}
              displayedOptions={currencyData?.map((c) => c.name) ?? []}
              {...register('currency')}
            />
            <LocationFormComponent
              defaultCountry={defaultValues.country}
              defaultProvince={defaultValues.province}
              defaultCity={defaultValues.city}
            />
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
              defaultImageIPFS={defaultValues.imageUrl ?? ''}
              label={t('image')}
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
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

export default ModifyCauseModal
