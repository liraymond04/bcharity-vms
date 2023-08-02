import {
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  PublicationMetadataV2Input
} from '@lens-protocol/client'
import { ProfileFragment as Profile } from '@lens-protocol/client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 } from 'uuid'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { Form } from '@/components/UI/Form'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { APP_NAME } from '@/constants'
import getUserLocale from '@/lib/getUserLocale'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import createPost from '@/lib/lens-protocol/createPost'
import { PostTags } from '@/lib/metadata'
import { GoalMetadataAttributeInput } from '@/lib/types'

import Error from './Error'

export interface IPublishGoalFormProps {
  goal: string

  goalDate: string
}

export const emptyPublishFormData: IPublishGoalFormProps = {
  goal: '',

  goalDate: ''
}

export const createPublishAttributes = (
  id: string,
  data: IPublishGoalFormProps
) => {
  const attributes: GoalMetadataAttributeInput[] = [
    {
      traitType: 'goal',
      displayType: PublicationMetadataDisplayTypes.String,
      value: data.goal
    },

    {
      traitType: 'goalDate',
      displayType: PublicationMetadataDisplayTypes.String,
      value: data.goalDate
    }
  ]

  return attributes
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
  const [endDateDisabled, setEndDateDisabled] = useState<boolean>(true)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)

  const form = useForm<IPublishGoalFormProps>()

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors }
  } = form

  const validUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

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

    const attributes = createPublishAttributes(v4(), data)

    const metadata: PublicationMetadataV2Input = {
      version: '2.0.0',
      metadata_id: v4(),
      content: `#${PostTags.OrgPublish.Goal}`,
      locale: getUserLocale(),
      tags: [PostTags.OrgPublish.Goal],
      mainContentFocus: PublicationMainFocus.TextOnly,
      name: `${PostTags.OrgPublish.Goal} by ${publisher?.handle}`,
      attributes,
      appId: APP_NAME
    }

    try {
      await checkAuth(publisher.ownedBy)

      await createPost(
        publisher,
        metadata,
        {
          freeCollectModule: {
            followerOnly: false
          }
        },
        { followerOnlyReferenceModule: false }
      )

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
              change={() => {}}
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
