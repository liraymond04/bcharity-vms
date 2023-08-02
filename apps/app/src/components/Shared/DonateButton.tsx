import { PostFragment } from '@lens-protocol/client'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { CURRENCIES } from '@/constants'
import getTokenImage from '@/lib/getTokenImage'
import { getAttribute } from '@/lib/lens-protocol/getAttribute'

import ErrorModal from '../Dashboard/Modals/Error'
import { Button } from '../UI/Button'
import { Form } from '../UI/Form'
import { Input } from '../UI/Input'
import { Modal } from '../UI/Modal'
import { Spinner } from '../UI/Spinner'

interface Props {
  post: PostFragment
}

export interface IDonateFormProps {
  contribution: string
}

const DonateButton: FC<Props> = ({ post }) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error>()
  const selectedCurrencySymbol =
    CURRENCIES[
      getAttribute(
        post.metadata.attributes,
        'currency'
      ) as keyof typeof CURRENCIES
    ].symbol

  const [currentContribution, setCurrentContribution] = useState<string>(
    getAttribute(post.metadata.attributes, 'contribution')
  )
  const [formContribution, setFormContribution] =
    useState<string>(currentContribution)

  const form = useForm<IDonateFormProps>()

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors }
  } = form

  const onCancel = () => {
    reset()
    setError(undefined)
    setRun(true)
    setShowModal(false)
  }

  const onSubmit = async (formData: IDonateFormProps) => {
    setError(undefined)
    // await apply(
    //   currentUser,
    //   formData.hoursToVerify,
    //   formData.comments,
    //   onCancel
    // )
  }

  const onSet = async () => {
    setError(undefined)
    try {
      // const result = lensClient().publication.createCommentTypedData
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    }
  }

  const [run, setRun] = useState<boolean>(true)
  useEffect(() => {
    if (run) {
      form.setValue('contribution', currentContribution)
      setFormContribution(currentContribution)
      setRun(false)
    }
  }, [run])

  return (
    <>
      <Modal title="Donate" show={showModal} onClose={onCancel}>
        <div className="mx-12 mt-5">
          {!isLoading ? (
            <Form
              form={form}
              onSubmit={() => handleSubmit((data) => onSubmit(data))}
            >
              <div className="flex items-end space-x-4">
                <Input
                  label="Contribution"
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
                  defaultValue={currentContribution}
                  error={!!errors.contribution?.type}
                  {...register('contribution', {
                    required: true,
                    min: {
                      value: 1,
                      message: 'Invalid amount'
                    }
                  })}
                  onChange={(e) => {
                    setFormContribution(e.target.value)
                  }}
                />
                <Button
                  className="h-10"
                  disabled={currentContribution === formContribution}
                  onClick={onSet}
                >
                  Set
                </Button>
              </div>
            </Form>
          ) : (
            <Spinner />
          )}

          {error && (
            <ErrorModal
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
            Donate
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
        Donate
      </Button>
    </>
  )
}

export default DonateButton
