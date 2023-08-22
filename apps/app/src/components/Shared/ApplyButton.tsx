import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useAppPersistStore } from '@/store/app'

import ErrorComponent from '../Dashboard/Modals/Error'
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
}

export interface IApplyFormProps {
  resume: string
  description: string
}

/**
 * Component to display a button that opens a modal with a form to
 * make an application to a volunteer opportunity
 */
const ApplyButton: FC<ApplyButtonProps> = ({
  publicationId,
  organizationId
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.volunteers.apply-to-opportunity-modal'
  })

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
  }

  const [resume, setResume] = useState<File>()

  const onSubmit = async (formData: IApplyFormProps) => {
    // handle on submit here
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
              className=" shrink-0 text-2xl my-5 w-52 h-16 align-middle"
              type="submit"
              onClick={handleSubmit((data) => onSubmit(data))}
              suppressHydrationWarning
            >
              {t('submit')}
            </Button>
          </div>
        </Form>
      </Modal>
      <Button
        onClick={() => {
          setShowModal(true)
        }}
      >
        {t('apply')}
      </Button>
    </div>
  )
}

export default ApplyButton
