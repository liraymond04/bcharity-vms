import { ProfileFragment, PublicationFragment } from '@lens-protocol/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { FileInput } from '@/components/UI/FileInput'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import { checkAuth, lensClient } from '@/lib/lens-protocol'
import { getOpportunityMetadata } from '@/lib/metadata'

import Error from './Error'
import { IPublishOpportunityFormProps } from './PublishOpportunityModal'

/**
 * Properties of {@link DeleteOpportunityModal}
 */
export interface IDeleteOpportunityModalProps {
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
   * Default post values displayed in the form
   */
  values: IPublishOpportunityFormProps
  /**
   * List of the posts to be deleted
   */
  postData: PublicationFragment[]
}

/**
 * Component that displays a popup modal for deleting a volunteer opportunity post, wraps a {@link GradientModal}.
 *
 * Used in {@link components.Dashboard.OrganizationDashboard.OrganizationVHR}
 */
const DeleteOpportunityModal: React.FC<IDeleteOpportunityModalProps> = ({
  open,
  onClose,
  id,
  publisher,
  values,
  postData
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.modals.delete-opportunity'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })
  const [publicationIds, setPublicationIds] = useState<string[]>([])

  const [pending, setPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const ids = getOpportunityMetadata(postData).map((p) => p.post_id)

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
            <Input label={t('name')} value={values.name} disabled />

            <Input
              label={t('start-date')}
              type="date"
              value={values.startDate}
              disabled
            />
            <Input
              label={t('end-date')}
              type="endDate"
              value={values.endDate}
              disabled
            />
            <Input label={t('hours')} value={values.hoursPerWeek} disabled />
            <Input label={t('category')} value={values.category} disabled />
            <Input label={t('website')} value={values.website} disabled />
            <TextArea
              label={t('description')}
              value={values.description}
              disabled
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
                  style={{
                    appearance: 'none',
                    backgroundColor: values.applicationRequired
                      ? 'purple'
                      : 'transparent',
                    border: '1px solid grey',
                    width: '25px',
                    height: '25px'
                  }}
                  disabled
                />
                <span style={{ marginLeft: '12px' }} suppressHydrationWarning>
                  {t('registration-required')}
                </span>
              </label>
            </div>
            <FileInput
              defaultImageIPFS={values.imageUrl ?? ''}
              disabled
              label={t('image')}
              accept="image/*"
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

export default DeleteOpportunityModal
