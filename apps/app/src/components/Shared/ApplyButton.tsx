import { useStorageUpload } from '@thirdweb-dev/react'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { checkAuth, useCreateComment } from '@/lib/lens-protocol'
import { buildMetadata, PostTags } from '@/lib/metadata'
import { ApplicationMetadataRecord } from '@/lib/metadata/ApplicationMetadata'
import { MetadataVersion } from '@/lib/types'
import { useAppPersistStore } from '@/store/app'

import ErrorComponent from '../Dashboard/Modals/Error'
import { Spinner } from '../UI'
import { Button } from '../UI/Button'
import { FileInput } from '../UI/FileInput'
import { Form } from '../UI/Form'
import { Modal } from '../UI/Modal'
import { TextArea } from '../UI/TextArea'

/**
 * Properties of {@link LogHoursButton}
 */
export interface ApplyButtonProps {
  /**
   * ID of the publication the application is sent to
   */
  publicationId: string
  /**
   * ID of the organization the application is sent to
   */
  organizationId: string
  /**
   * Whether the application has already been rejected
   */
  rejected?: boolean
}

export interface IApplyFormProps {
  resume: string
  description: string
}

/**
 * Component to display a button that opens a modal with a form to
 * make an application to a volunteer opportunity.
 *
 * An application is made by creating a comment with the {@link createComment}
 * hook under the volunteer opportunity with the metadata tag {@link PostTags.Application.Apply}.
 * The manual attribute is set to false.
 */
const ApplyButton: FC<ApplyButtonProps> = ({
  publicationId,
  organizationId,
  rejected
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.volunteers.apply-to-opportunity-modal'
  })
  const { t: e } = useTranslation('common', {
    keyPrefix: 'errors'
  })

  const [error, setModalError] = useState<Error>()

  const { currentUser } = useAppPersistStore()

  const [showModal, setShowModal] = useState<boolean>(false)

  const form = useForm<IApplyFormProps>()

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
    setError,
    clearErrors
  } = form

  const onCancel = () => {
    reset()
    setShowModal(false)
    setResume(undefined)
    setModalError(undefined)
  }

  const { mutateAsync: upload } = useStorageUpload()
  const { createComment } = useCreateComment()

  const [resume, setResume] = useState<File>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = async (formData: IApplyFormProps) => {
    if (resume === undefined) {
      setError('resume', {
        type: 'required',
        message: 'A resume is required.'
      })
      return
    }

    setModalError(undefined)
    setIsLoading(true)

    try {
      if (!currentUser) throw Error(e('profile-null'))
      console.log(formData)

      await checkAuth(currentUser.ownedBy.address)

      const resumeUrl = (await upload({ data: [resume] }))[0]

      const metadata = buildMetadata<ApplicationMetadataRecord>(
        currentUser,
        [PostTags.Application.Apply],
        {
          version: MetadataVersion.ApplicationMetadataVersion['1.0.0'],
          type: PostTags.Application.Apply,
          resume: resumeUrl,
          description: formData.description,
          manual: 'false'
        }
      )

      await createComment({
        profileId: currentUser.id,
        publicationId: publicationId,
        metadata
      })

      setShowModal(false)
      setResume(undefined)
    } catch (error) {
      if (error instanceof Error) {
        setModalError(error)
      }
    }
    setIsLoading(false)
  }

  return (
    <div>
      <Modal show={showModal} title="" size="lg" onClose={onCancel}>
        <Form
          form={form}
          onSubmit={() => handleSubmit((data) => onSubmit(data))}
        >
          <div className="px-10 py-4 flex flex-col space-y-4">
            <div className="flex flex-row ">
              <div
                className="text-purple-500 text-5xl font-bold"
                suppressHydrationWarning
              >
                {t('title')}
              </div>
            </div>
            <div className="text-3xl font-semibold" suppressHydrationWarning>
              {t('upload')}
            </div>
            <div className="flex items-center justify-left w-full space-x-2">
              <FileInput
                label="Resume"
                accept="pdf/*"
                error={!!errors.resume?.type}
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0]

                  if (selectedFile?.type != 'application/pdf') {
                    setError('resume', {
                      type: 'filetype',
                      message: 'Only PDFs are valid.'
                    })
                    return
                  }

                  clearErrors()
                  setResume(selectedFile)
                }}
              />
              {errors.resume?.message && (
                <ErrorComponent message={errors.resume.message} />
              )}
            </div>
            <div className="">
              <label
                htmlFor="large-input"
                className="block mb-2 text-3xl font-semibold"
                suppressHydrationWarning
              >
                {t('description')}
              </label>
              <TextArea
                placeholder={'Add a description here'}
                {...register('description')}
              />
            </div>
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
      <Button
        onClick={() => {
          setShowModal(true)
        }}
      >
        {rejected ? t('apply-rejected') : t('apply')}
      </Button>
    </div>
  )
}

export default ApplyButton
