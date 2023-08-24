import {
  Erc20Fragment,
  ProfileFragment,
  PublicationFragment
} from '@lens-protocol/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import FormDropdown from '@/components/Shared/FormDropdown'
import GradientModal from '@/components/Shared/Modal/GradientModal'
import DisabledLocationDropdowns from '@/components/UI/DisabledLocationDropdowns'
import { FileInput } from '@/components/UI/FileInput'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import getTokenImage from '@/lib/getTokenImage'
import { checkAuth, lensClient } from '@/lib/lens-protocol'
import { getCauseMetadata } from '@/lib/metadata'

import Error from './Error'
import { IPublishCauseFormProps } from './PublishCauseModal'

interface IDeleteCauseModalProps {
  open: boolean
  onClose: (shouldRefetch: boolean) => void
  id: string
  publisher: ProfileFragment | null
  values: IPublishCauseFormProps
  postData: PublicationFragment[]
  currencyData: Erc20Fragment[] | undefined
}

const DeleteCauseModal: React.FC<IDeleteCauseModalProps> = ({
  open,
  onClose,
  id,
  publisher,
  values,
  postData,
  currencyData
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.modals.delete-cause'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const [publicationIds, setPublicationIds] = useState<string[]>([])

  const [pending, setPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const selectedCurrencySymbol =
    currencyData?.find((c) => c.address === values.currency)?.symbol ?? 'WMATIC'

  useEffect(() => {
    const ids = getCauseMetadata(postData).map((p) => p.post_id)

    setPublicationIds(ids)
  }, [id, postData])

  const onCancel = () => {
    setErrorMessage('')
    onClose(false)
  }

  const onSubmit = () => {
    setErrorMessage('')
    setPending(false)

    if (!publisher) {
      setErrorMessage(e('profile-null'))
      setPending(false)
      return
    }

    checkAuth(publisher.ownedBy)
      .then(() =>
        Promise.all(
          publicationIds.map((id) =>
            lensClient().publication.hide({ publicationId: id })
          )
        )
      )
      .then((res) => {
        res.map((r) => {
          if (r.isFailure()) {
            throw r.error.message
          }
        })
      })
      .then(() => {
        onClose(true)
      })
      .catch((e) => {
        setErrorMessage(e.message)
      })
      .finally(() => {
        setPending(false)
      })
  }
  return (
    <GradientModal
      title={t('title')}
      open={open}
      onCancel={onCancel}
      onSubmit={onSubmit}
      submitDisabled={pending}
    >
      <div className="mx-12">
        {!pending ? (
          <>
            <Input label={t('name')} defaultValue={values.name} disabled />

            <Input
              label={t('category')}
              defaultValue={values.category}
              disabled
            />

            <FormDropdown
              disabled
              label={t('selected-currency')}
              options={currencyData?.map((c) => c.name) ?? []}
              defaultValue={
                currencyData?.find((c) => c.address === values.currency)
                  ?.name ?? ''
              }
            />

            <Input
              disabled
              label={t('contribution')}
              type="number"
              step="0.0001"
              min="0"
              max="100000"
              value={values.contribution}
              prefix={
                <img
                  className="w-6 h-6"
                  height={24}
                  width={24}
                  src={getTokenImage(selectedCurrencySymbol)}
                  alt={selectedCurrencySymbol}
                />
              }
            />
            <DisabledLocationDropdowns
              country={values.country}
              province={values.province}
              city={values.city}
            />
            <Input
              disabled
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
              value={values.goal}
            />
            <Input label={t('recipient')} value={values.recipient} disabled />
            <TextArea
              label={t('description')}
              value={values.description}
              disabled
            />
            <FileInput
              defaultImageIPFS={values.imageUrl ?? ''}
              label={t('image')}
              accept="image/*"
              disabled
            />
          </>
        ) : (
          <Spinner />
        )}

        {!!errorMessage && (
          <Error
            message={`${e('generic-front')}${errorMessage}${e('generic-back')}`}
          />
        )}
      </div>
    </GradientModal>
  )
}

export default DeleteCauseModal
