import {
  Erc20Fragment,
  PublicationMainFocus,
  PublicationMetadataV2Input
} from '@lens-protocol/client'
import { ProfileFragment as Profile } from '@lens-protocol/client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { Form } from '@/components/UI/Form'
import { Input } from '@/components/UI/Input'
import LocationFormComponent from '@/components/UI/LocationDropdowns'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import { APP_NAME, DEFAULT_COLLECT_TOKEN } from '@/constants'
import getTokenImage from '@/lib/getTokenImage'
import getUserLocale from '@/lib/getUserLocale'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import createPost from '@/lib/lens-protocol/createPost'
import useEnabledCurrencies from '@/lib/lens-protocol/useEnabledCurrencies'
import { PostTags } from '@/lib/types'

import Error from './Error'
import {
  createPublishAttributes,
  IPublishCauseFormProps
} from './PublishCauseModal'

interface IPublishCauseModalProps {
  open: boolean
  onClose: (shouldRefetch: boolean) => void
  id: string
  publisher: Profile | null
  defaultValues: IPublishCauseFormProps
}

const ModifyCauseModal: React.FC<IPublishCauseModalProps> = ({
  open,
  onClose,
  id,
  publisher,
  defaultValues
}) => {
  const { t } = useTranslation('common')
  const [isPending, setIsPending] = useState<boolean>(false)

  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    DEFAULT_COLLECT_TOKEN
  )
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] =
    useState<string>('WMATIC')

  const { data: currencyData } = useEnabledCurrencies(publisher?.ownedBy)

  const form = useForm<IPublishCauseFormProps>({ defaultValues })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues])

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors }
  } = form

  const onCancel = () => {
    reset(defaultValues)
    onClose(false)
  }

  const onSubmit = async (formData: IPublishCauseFormProps) => {
    setError(false)
    setIsPending(true)

    if (!publisher) {
      setErrorMessage('No publisher provided')
      setError(true)
      setIsPending(false)
      return
    }

    const attributes = createPublishAttributes({
      id,
      selectedCurrency,
      formData
    })

    const metadata: PublicationMetadataV2Input = {
      version: '2.0.0',
      metadata_id: id,
      content: `#${PostTags.OrgPublish.Cause}`,
      locale: getUserLocale(),
      tags: [PostTags.OrgPublish.Cause],
      mainContentFocus: PublicationMainFocus.TextOnly,
      name: `${PostTags.OrgPublish.Cause} by ${publisher?.handle}`,
      attributes,
      appId: APP_NAME
    }

    checkAuth(publisher.ownedBy)
      .then(() =>
        createPost(
          publisher,
          metadata,
          {
            freeCollectModule: {
              followerOnly: false
            }
          },
          { followerOnlyReferenceModule: false }
        )
      )
      .then((res) => {
        if (res.isFailure()) {
          setError(true)
          setErrorMessage(res.error.message)
          throw res.error.message
        }
      })
      .then(() => {
        reset(formData)
        onClose(true)
      })
      .catch((e) => {
        setErrorMessage(e.message)
        setError(true)
      })
      .finally(() => {
        setIsPending(false)
      })
  }

  return (
    <GradientModal
      title={'Modify Fundraiser'}
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
              label="Fundraiser name"
              placeholder="Medical internship"
              error={!!errors.name?.type}
              {...register('name', {
                required: true,
                maxLength: 255
              })}
            />
            <Input
              label="Category"
              placeholder="Healthcare"
              error={!!errors.category?.type}
              {...register('category', {
                required: true,
                maxLength: 40
              })}
            />
            <div>
              <div className="label">{t('Select currency')}</div>
              <select
                className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
                onChange={(e) => {
                  const currency = e.target.value.split('-')
                  setSelectedCurrency(currency[0])
                  setSelectedCurrencySymbol(currency[1])
                }}
              >
                {currencyData?.map((currency: Erc20Fragment) => (
                  <option
                    key={currency.address}
                    value={`${currency.address}-${currency.symbol}`}
                  >
                    {currency.name}
                  </option>
                ))}
              </select>
            </div>
            <LocationFormComponent
              defaultCountry={defaultValues.country}
              defaultProvince={defaultValues.province}
              defaultCity={defaultValues.city}
            />
            <Input
              label={t('Contribution')}
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
                min: {
                  value: 1,
                  message: 'Invalid amount'
                }
              })}
            />
            <Input
              label={t('Funding goal')}
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
              placeholder="420"
              {...register('goal', { required: true })}
            />
            <Input
              label={t('Recipient')}
              type="text"
              placeholder="0x3A5bd...5e3"
              {...register('recipient', {
                required: true,
                pattern: {
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: 'Invalid Ethereum address'
                }
              })}
            />
            <TextArea
              label="Description"
              placeholder="Tell us more about this fundraiser"
              error={!!errors.description?.type}
              {...register('description', { required: true, maxLength: 1000 })}
            />
          </Form>
        ) : (
          <Spinner />
        )}

        {error && (
          <Error
            message={`An error occured: ${errorMessage}. Please try again.`}
          />
        )}
      </div>
    </GradientModal>
  )
}

export default ModifyCauseModal
