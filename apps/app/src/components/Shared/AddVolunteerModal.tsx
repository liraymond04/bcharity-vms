import { PlusCircleIcon } from '@heroicons/react/outline'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Spinner } from '@/components/UI'
import { Input } from '@/components/UI'
import {
  checkAuth,
  getProfile,
  lensClient,
  useCreateComment
} from '@/lib/lens-protocol'
import { buildMetadata, PostTags } from '@/lib/metadata'
import { ApplicationMetadataRecord } from '@/lib/metadata/ApplicationMetadata'
import { MetadataVersion } from '@/lib/types'
import { useAppPersistStore } from '@/store/app'

import ErrorComponent from '../Dashboard/Modals/Error'
import { Button } from '../UI/Button'
import { Form } from '../UI/Form'
import { Modal } from '../UI/Modal'

export interface IAddVolunteerFormProps {
  opportunityID: string
  handle: string
}

/**
 * Component that displays a button for manually adding a volunteer application.
 *
 * An application is made by creating a comment with the {@link useCreateComment}
 * hook under the volunteer opportunity with the metadata tag {@link PostTags.Application.Apply}.
 * The manual attribute is set to true, and the volunteer's profile ID is added
 * to the description of the application, and no resume is passed.
 *
 * The organization ID is verified using the Lens {@link https://docs.lens.xyz/docs/get-publication | publication.fetch} method,
 * and the volunteer's profile ID is verified using the Lens {@link getProfile} hook.
 */
const AddVolunteerModal: FC = () => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.management.add-volunteer'
  })
  const { t: e } = useTranslation('common', {
    keyPrefix: 'errors'
  })

  const [error, setModalError] = useState<Error>()

  const { currentUser } = useAppPersistStore()

  const [showModal, setShowModal] = useState<boolean>(false)

  const form = useForm<IAddVolunteerFormProps>()

  const {
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    register,
    clearErrors
  } = form

  const onCancel = () => {
    reset()
    setShowModal(false)
    setModalError(undefined)
    setIsLoading(false)
    clearErrors()
  }

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { createComment } = useCreateComment()

  const onSubmit = async (formData: IAddVolunteerFormProps) => {
    setModalError(undefined)
    setIsLoading(true)
    clearErrors()

    try {
      const resultPublication = await lensClient().publication.fetch({
        forId: formData.opportunityID
      })

      if (resultPublication === null) {
        throw Error()
      }
    } catch (error) {
      setError('opportunityID', {
        type: 'invalid',
        message: t('opportunity-id-invalid')
      })
      setIsLoading(false)
      return
    }

    const result = await getProfile({ handle: formData.handle })

    if (result === null) {
      setError('handle', {
        type: 'invalid',
        message: t('handle-invalid')
      })
      setIsLoading(false)
      return
    }

    try {
      if (!currentUser) throw Error(e('profile-null'))

      await checkAuth(currentUser.ownedBy.address, currentUser.id)

      const metadata = buildMetadata<ApplicationMetadataRecord>(
        currentUser,
        [PostTags.Application.Apply],
        {
          version: MetadataVersion.ApplicationMetadataVersion['1.0.0'],
          type: PostTags.Application.Apply,
          resume: '',
          description: `${result.id}`,
          manual: 'true'
        }
      )

      await createComment({
        profileId: currentUser.id,
        publicationId: formData.opportunityID,
        metadata
      })

      setShowModal(false)
      reset()
    } catch (error) {
      if (error instanceof Error) {
        setModalError(error)
      }
    }
    setIsLoading(false)
  }

  return (
    <div>
      <Modal show={showModal} title={t('title')} size="md" onClose={onCancel}>
        <Form
          form={form}
          onSubmit={() => handleSubmit((data) => onSubmit(data))}
        >
          <div className="px-10 py-4 flex flex-col space-y-4">
            <Input
              label={t('opportunity-id')}
              type="text"
              placeholder="0x40d2-0x60"
              error={!!errors.opportunityID?.type}
              {...register('opportunityID', { required: true })}
            />
            <Input
              label={t('handle')}
              type="text"
              placeholder="test.test"
              error={!!errors.handle?.type}
              {...register('handle', { required: true })}
            />
          </div>
          <div className="flex items-center justify-center">
            {' '}
            <Button
              type="submit"
              icon={isLoading && <Spinner size="sm" />}
              disabled={isLoading}
              onClick={handleSubmit((data) => onSubmit(data))}
              suppressHydrationWarning
            >
              {t('submit')}
            </Button>
          </div>
        </Form>
        <div className="m-4">
          {error && (
            <ErrorComponent
              message={`${e('generic-front')}${error.message}${e(
                'generic-back'
              )}`}
            />
          )}
        </div>
      </Modal>
      <div
        className="flex items-center shrink-0 justify-end ml-auto hover:cursor-pointer"
        onClick={() => {
          setShowModal(true)
        }}
      >
        <p suppressHydrationWarning>{t('title')}</p>
        <PlusCircleIcon className="ml-2 w-8 text-brand-400" />
      </div>
    </div>
  )
}

export default AddVolunteerModal
