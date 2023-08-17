import Error from '@components/Dashboard/Modals/Error'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useLogHours } from '@/lib/lens-protocol'
import { useAppPersistStore } from '@/store/app'

import { Button } from '../UI/Button'
import { Form } from '../UI/Form'
import { Input } from '../UI/Input'
import { Modal } from '../UI/Modal'
import { Spinner } from '../UI/Spinner'
import { TextArea } from '../UI/TextArea'

/**
 * Properties of {@link LogHoursButton}
 */
export interface LogHoursButtonProps {
  /**
   * Default value passed to the log hours form
   */
  hoursDefault: string
  /**
   * ID of the publication the log hours request is made to
   */
  publicationId: string
  /**
   * ID of the organization the log hours request is made to
   */
  organizationId: string
}

export interface IVhrVerificationFormProps {
  hoursToVerify: string
  comments: string
}

/**
 * Component to display a button that opens a modal with a form to
 * make a request to log hours/VHR
 *
 * The component uses the {@link useLogHours} hook to handle sending
 * the request to the opportunity post
 */
const LogHoursButton: FC<LogHoursButtonProps> = ({
  hoursDefault,
  publicationId,
  organizationId
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.shared.apply-button'
  })

  const { currentUser } = useAppPersistStore()

  const [showModal, setShowModal] = useState<boolean>(false)
  const { error, isLoading, logHours } = useLogHours({
    publicationId,
    organizationId
  })

  const form = useForm<IVhrVerificationFormProps>()

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors }
  } = form

  const onCancel = () => {
    reset()
    setShowModal(false)
  }

  const onSubmit = async (formData: IVhrVerificationFormProps) => {
    await logHours(
      currentUser,
      formData.hoursToVerify,
      formData.comments,
      onCancel
    )
  }

  return (
    <div>
      <Modal title={t('create')} show={showModal} onClose={onCancel}>
        <div className="mx-12 mt-5">
          {!isLoading ? (
            <Form
              form={form}
              onSubmit={() => handleSubmit((data) => onSubmit(data))}
            >
              <Input
                label={t('num-hours')}
                type="number"
                placeholder="5.5"
                step="0.1"
                min="0.1"
                defaultValue={hoursDefault}
                error={!!errors.hoursToVerify?.type}
                {...register('hoursToVerify', {
                  required: true,
                  pattern: {
                    value: /^(?!0*[.,]0*$|[.,]0*$|0*$)\d+[,.]?\d{0,1}$/,
                    message: t('invalid-hours')
                  }
                })}
              />
              <TextArea
                suppressHydrationWarning
                label={t('comment')}
                placeholder={t('placeholder')}
                error={!!errors.comments?.type}
                {...register('comments', { required: false, maxLength: 1000 })}
              />
            </Form>
          ) : (
            <Spinner />
          )}

          {error && (
            <Error
              message={`${t('error-occurred')}${error}${t('try-again')}`}
            />
          )}
        </div>
        <div className="py-4 custom-divider"></div>
        <div className="flex px-4 py-3 justify-between">
          <Button
            onClick={handleSubmit((data) => onSubmit(data))}
            className={`${
              isLoading ? 'bg-gray-400 hover:bg-gray-400 !border-black' : ''
            } px-6 py-2 font-medium`}
            disabled={isLoading}
          >
            {t('submit')}
          </Button>
          <Button
            onClick={onCancel}
            variant="secondary"
            className="px-6 py-2 font-medium"
          >
            {t('cancel')}
          </Button>
        </div>
      </Modal>
      <Button
        onClick={() => {
          setShowModal(true)
        }}
      >
        {t('button-label')}
      </Button>
    </div>
  )
}

export default LogHoursButton
