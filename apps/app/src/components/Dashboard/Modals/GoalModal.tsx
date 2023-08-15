import { PublicationMetadataV2Input } from '@lens-protocol/client'
import { ProfileFragment as Profile } from '@lens-protocol/client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { Form } from '@/components/UI/Form'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import useCreatePost from '@/lib/lens-protocol/useCreatePost'
import { buildMetadata, GoalMetadataRecord, PostTags } from '@/lib/metadata'
import { MetadataVersion } from '@/lib/types'

import Error from './Error'

export interface IPublishGoalFormProps {
  goal: string
  goalDate: string
}

export const emptyPublishFormData: IPublishGoalFormProps = {
  goal: '',
  goalDate: ''
}

interface IPublishGoalModalProps {
  open: boolean
  onClose: (shouldRefetch: boolean) => void
  publisher: Profile | null
}

const GoalModal: React.FC<IPublishGoalModalProps> = ({
  open,
  onClose,
  publisher
}) => {
  const { createPost } = useCreatePost()

  const [isPending, setIsPending] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const form = useForm<IPublishGoalFormProps>()

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors }
  } = form

  const onCancel = () => {
    reset()
    onClose(false)
  }

  const onSubmit = async (data: IPublishGoalFormProps) => {
    setError(false)
    setIsPending(true)

    if (!publisher) {
      setErrorMessage('No publisher provided')
      setError(true)
      setIsPending(false)
      return
    }

    const metadata: PublicationMetadataV2Input =
      buildMetadata<GoalMetadataRecord>(publisher, [PostTags.OrgPublish.Goal], {
        ...data,
        version: MetadataVersion.GoalMetadataVersion['1.0.0'],
        type: PostTags.OrgPublish.Goal
      })

    try {
      await checkAuth(publisher.ownedBy)

      await createPost({ profileId: publisher.ownedBy, metadata })

      reset()
      onClose(true)
    } catch (e: any) {
      setErrorMessage(e.message)
      setError(true)
    }
    setIsPending(false)
  }

  return (
    <GradientModal
      title={'Set New Goal'}
      open={open}
      onCancel={onCancel}
      onSubmit={handleSubmit((data) => onSubmit(data))}
      submitDisabled={isPending}
    >
      <div className="mx-12">
        {!isPending ? (
          <Form
            form={form}
            onSubmit={() => handleSubmit((data) => onSubmit(data))}
          >
            <Input
              label="Set a Goal"
              type="number"
              placeholder="100"
              step="0.1"
              min="0.1"
              error={!!errors.goal?.type}
              {...register('goal', {
                required: true,
                pattern: {
                  value: /^(?!0*[.,]0*$|[.,]0*$|0*$)\d+[,.]?\d{0,1}$/,
                  message:
                    'Goal should be a positive number with zero decimal places'
                }
              })}
            />

            <Input
              label="Goal Date"
              type="date"
              placeholder="yyyy-mm-dd"
              {...register('goalDate', {})}
            />
          </Form>
        ) : (
          <Spinner />
        )}

        {error && (
          <Error
            message={`An error occured: ${errorMessage}. Please try again.`}
          />
        )}
      </div>
    </GradientModal>
  )
}

export default GoalModal
