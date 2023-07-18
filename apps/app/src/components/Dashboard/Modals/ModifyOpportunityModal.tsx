import {
  PublicationMainFocus,
  PublicationMetadataV2Input
} from '@lens-protocol/client'
import { ProfileFragment as Profile } from '@lens-protocol/client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { Form } from '@/components/UI/Form'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import { APP_NAME } from '@/constants'
import getUserLocale from '@/lib/getUserLocale'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import createPost from '@/lib/lens-protocol/createPost'
import { PostTags } from '@/lib/types'

import Error from './Error'
import {
  createPublishAttributes,
  IPublishOpportunityFormProps
} from './PublishOpportunityModal'

interface IPublishOpportunityModalProps {
  open: boolean
  onClose: (shouldRefetch: boolean) => void
  id: string
  publisher: Profile | null
  defaultValues: IPublishOpportunityFormProps
}

const ModifyOpportunityModal: React.FC<IPublishOpportunityModalProps> = ({
  open,
  onClose,
  id,
  publisher,
  defaultValues
}) => {
  console.log('default', defaultValues)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const form = useForm<IPublishOpportunityFormProps>({ defaultValues })

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

  const onSubmit = async (data: IPublishOpportunityFormProps) => {
    setError(false)
    setIsPending(true)
    console.log('test')

    if (!publisher) {
      setErrorMessage('No publisher provided')
      setError(true)
      setIsPending(false)
      return
    }

    const attributes = createPublishAttributes(id, data)

    const metadata: PublicationMetadataV2Input = {
      version: '2.0.0',
      metadata_id: id,
      content: `#${PostTags.OrgPublish}`,
      locale: getUserLocale(),
      tags: [PostTags.OrgPublish],
      mainContentFocus: PublicationMainFocus.TextOnly,
      name: `${PostTags.OrgPublish} by ${publisher?.handle}`,
      attributes,
      appId: APP_NAME
    }

    checkAuth(publisher.ownedBy)
      .then(() => createPost(publisher, metadata))
      .then((res) => {
        if (res.isFailure()) {
          setError(true)
          setErrorMessage(res.error.message)
          throw res.error.message
        }
      })
      .then(() => {
        reset()
        onClose(true)
      })
      .catch((e) => {
        setErrorMessage(e.message)
        setError(true)
      })
      .finally(() => {
        setIsPending(false)
      })
  }

  return (
    <GradientModal
      title={'Modify Volunteer Opportunity'}
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
              key={`${Math.floor(Math.random() * 1000)}-min`}
              label="Volunteer opportunity name"
              placeholder="Medical internship"
              error={!!errors.opportunityName?.type}
              defaultValue={defaultValues.opportunityName}
              {...register('opportunityName', {
                required: true,
                maxLength: 100
              })}
            />
            <Input
              label="Date(s)"
              type="date"
              placeholder="yyyy-mm-dd"
              error={!!errors.dates?.type}
              defaultValue={defaultValues.dates}
              {...register('dates', {
                required: true
              })}
            />
            <Input
              label="Expected number of hours"
              placeholder="5.5"
              error={!!errors.numHours?.type}
              defaultValue={defaultValues.numHours}
              {...register('numHours', {
                required: true,
                pattern: {
                  value: /^(?!0*[.,]0*$|[.,]0*$|0*$)\d+[,.]?\d{0,1}$/,
                  message:
                    'Hours should be a positive number with at most one decimal place'
                }
              })}
            />
            <Input
              label="Category"
              placeholder="Healthcare"
              error={!!errors.category?.type}
              defaultValue={defaultValues.category}
              {...register('category', { required: true, maxLength: 40 })}
            />
            <Input
              label="Website (leave empty if not linking to external opportunity)"
              placeholder="https://ecssen.ca/opportunity-link"
              error={!!errors.website?.type}
              defaultValue={defaultValues.website}
              {...(register('website'), { maxLength: 2000 })}
            />
            <TextArea
              label="Activity Description"
              placeholder="Tell us more about this volunteer opportunity"
              error={!!errors.description?.type}
              defaultValue={defaultValues.description}
              {...register('description', { required: true, maxLength: 250 })}
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

export default ModifyOpportunityModal
