import {
  Erc20Fragment,
  ProfileFragment,
  PublicationFragment
} from '@lens-protocol/client'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'

import FormDropdown from '@/components/Shared/FormDropdown'
import GradientModal from '@/components/Shared/Modal/GradientModal'
import DisabledLocationDropdowns from '@/components/UI/DisabledLocationDropdowns'
import { FileInput } from '@/components/UI/FileInput'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import getTokenImage from '@/lib/getTokenImage'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import lensClient from '@/lib/lens-protocol/lensClient'
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
      setErrorMessage('No publisher provided')
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
      title={'Delete Volunteer Opportunity'}
      open={open}
      onCancel={onCancel}
      onSubmit={onSubmit}
      submitDisabled={pending}
    >
      <div className="mx-12">
        {!pending ? (
          <>
            <Input label="Project name" defaultValue={values.name} disabled />

            <Input label="Category" defaultValue={values.category} disabled />

            <FormDropdown
              disabled
              label={t('Selected currency')}
              options={currencyData?.map((c) => c.name) ?? []}
              defaultValue={
                currencyData?.find((c) => c.address === values.currency)
                  ?.name ?? ''
              }
            />

            <Input
              disabled
              label={t('Contribution')}
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
              value={values.goal}
            />
            <Input label={t('Recipient')} value={values.recipient} disabled />
            <TextArea
              label="Activity Description"
              value={values.description}
              disabled
            />
            <FileInput
              defaultImageIPFS={values.imageUrl ?? ''}
              label="Image (optional): "
              accept="image/*"
              disabled
            />
          </>
        ) : (
          <Spinner />
        )}

        {!!errorMessage && (
          <Error
            message={`An error occured: ${errorMessage}. Please try again.`}
          />
        )}
      </div>
    </GradientModal>
  )
}

export default DeleteCauseModal
