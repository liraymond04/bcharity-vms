import Error from '@components/Dashboard/Modals/Error'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import useApply from '@/lib/lens-protocol/useApply'
import { useAppPersistStore } from '@/store/app'

import { Button } from '../UI/Button'
import { Form } from '../UI/Form'
import { Input } from '../UI/Input'
import { Modal } from '../UI/Modal'
import { Spinner } from '../UI/Spinner'

interface Props {
  hoursDefault: string
  publicationId: string
  organizationId: string
}

export interface IVhrVerificationFormProps {
  hoursToVerify: string
}

const ApplyButton: FC<Props> = ({
  hoursDefault,
  publicationId,
  organizationId
}) => {
  const { currentUser } = useAppPersistStore()

  const [showModal, setShowModal] = useState<boolean>(false)
  const { error, isLoading, apply } = useApply({
    publicationId,
    organizationId
  })

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

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
    await apply(currentUser, formData.hoursToVerify)
    onCancel()
  }

  return (
    <div>
      <Modal title="Create VHR request" show={showModal} onClose={onCancel}>
        <div className="mx-12 mt-5">
          {!isLoading ? (
            <Form
              form={form}
              onSubmit={() => handleSubmit((data) => onSubmit(data))}
            >
              <Input
                label="Number of hours to verify"
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
                    message:
                      'Hours should be a positive number with at most one decimal place'
                  }
                })}
              />
            </Form>
          ) : (
            <Spinner />
          )}

          {error && (
            <Error
              message={`An error occured: ${error.message}. Please try again.`}
            />
          )}
        </div>
        <div className="py-4 divider"></div>
        <div className="flex px-4 py-3 justify-between">
          <Button
            onClick={handleSubmit((data) => onSubmit(data))}
            className={`${
              isLoading ? 'bg-gray-400 hover:bg-gray-400 !border-black' : ''
            } px-6 py-2 font-medium`}
            disabled={isLoading}
          >
            Submit
          </Button>
          <Button
            onClick={onCancel}
            variant="secondary"
            className="px-6 py-2 font-medium"
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <Button
        onClick={() => {
          setShowModal(true)
        }}
      >
        Apply
      </Button>
    </div>
  )
}

export default ApplyButton
