import { ProfileFragment } from '@lens-protocol/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { FileInput } from '@/components/UI/FileInput'
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

import ErrorMessage from './Error'
import { IPublishOpportunityFormProps } from './PublishOpportunityModal'

/**
 * Properties of {@link PublishOpportunityDraftModal}
 */
export interface IPublishOpportunityDraftModalProps {
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
}

/**
 * Component that displays a popup modal for publishing a volunteer opportunity draft, wraps a {@link GradientModal}.
 *
 * Used in {@link components.Dashboard.OrganizationDashboard.OrganizationVHR}
 */
const PublishOpportunityDraftModal: React.FC<
  IPublishOpportunityDraftModalProps
> = ({ open, onClose, id, publisher, values }) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.modals.publish-opportunity-draft'
  })
  const { t: e } = useTranslation('common', { keyPrefix: 'errors' })

  const [pending, setPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { createPost } = useCreatePost()

  const onCancel = () => {
    setErrorMessage('')
    onClose(false)
  }

  const onSubmit = async () => {
    setErrorMessage('')
    setPending(false)

    if (!publisher) {
      setErrorMessage(e('profile-null'))
      setPending(false)
      return
    }

    try {
      setPending(true)
      const publishTag = PostTags.OrgPublish.Opportunity

      const metadata = buildMetadata<OpportunityMetadataRecord>(
        publisher,
        [publishTag],
        {
          version: MetadataVersion.OpportunityMetadataVersion['1.0.2'],
          type: publishTag,
          id,
          name: values.name,
          startDate: values.startDate,
          endDate: values.endDate,
          hoursPerWeek: values.hoursPerWeek,
          category: values.category,
          website: values.website,
          description: values.description,
          imageUrl: values.imageUrl,
          applicationRequired: values.applicationRequired ? 'true' : 'false'
        }
      )

      await checkAuth(publisher.ownedBy)
      await createPost({
        profileId: publisher.id,
        metadata
      })

      onClose(true)
    } catch (e: any) {
      if (e instanceof Error) {
        setErrorMessage(e.message)
      } else {
        console.error(e)
      }
    }
    setPending(false)
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
          <ErrorMessage
            message={`${e('generic-front')}${errorMessage}${e('generic-back')}`}
          />
        )}
      </div>
    </GradientModal>
  )
}

export default PublishOpportunityDraftModal
