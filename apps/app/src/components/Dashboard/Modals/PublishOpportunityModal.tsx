import {
  ContentFocus,
  CreatePostArgs,
  ProfileOwnedByMe,
  useCreatePost
} from '@lens-protocol/react-web'
import React from 'react'
import { useForm } from 'react-hook-form'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { Form } from '@/components/UI/Form'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import uploadToArweave from '@/lib/uploadToArweave'

interface IPublishOpportunityModalProps {
  open: boolean
  onClose: () => void
  publisher: ProfileOwnedByMe
}

interface IFormProps {
  opportunityName: string
  dates: string
  numHours: string
  program: string
  region: string
  category: string
  website: string
  description: string
}

const PublishOpportunityModal: React.FC<IPublishOpportunityModalProps> = ({
  open,
  onClose,
  publisher
}) => {
  const {
    execute,
    error: lensError,
    isPending
  } = useCreatePost({
    publisher,
    upload: uploadToArweave
  })

  const form = useForm<IFormProps>()

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors }
  } = form

  const onCancel = () => {
    reset()
    onClose()
  }

  const onSubmit = (data: IFormProps) => {
    const postData: CreatePostArgs = {
      content: JSON.stringify(data),
      contentFocus: ContentFocus.TEXT_ONLY,
      locale: 'en'
    }

    console.log(postData)

    execute(postData).then((result) => {
      if (result.isSuccess()) {
        reset()
        onClose()
      }
    })
    // create new social media post with data
  }

  return (
    <GradientModal
      title={'Publish New Volunteer Opportunity'}
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
              label="Volunteer opportunity name"
              placeholder="Medial internship"
              error={!!errors.opportunityName?.type}
              {...register('opportunityName', { required: true })}
            />
            <Input
              label="Date(s)"
              placeholder="yy-mm-dd"
              error={!!errors.dates?.type}
              {...register('dates', { required: true })}
            />
            <Input
              label="Expected number of hours"
              placeholder="5"
              error={!!errors.numHours?.type}
              {...register('numHours', { required: true })}
            />
            <Input
              label="Program"
              placeholder="Volunteer program names(s)"
              error={!!errors.program?.type}
              {...register('program', { required: true })}
            />
            <Input
              label="City/region"
              placeholder="Calgary"
              error={!!errors.region?.type}
              {...register('program', { required: true })}
            />
            <Input
              label="Category"
              placeholder="Healthcare"
              error={!!errors.category?.type}
              {...register('category', { required: true })}
            />
            <Input
              label="Website (leave empty if not linking to external opportunity)"
              placeholder="https://ecssen.ca/opportunity-link"
              error={!!errors.website?.type}
              {...register('website')}
            />
            <TextArea
              label="Activity Description"
              placeholder="Tell us more about this volunteer opportunity"
              error={!!errors.description?.type}
              {...register('description', { required: true })}
            />
          </Form>
        ) : (
          <Spinner />
        )}

        {lensError && <p>{lensError.message}</p>}
      </div>
    </GradientModal>
  )
}

export default PublishOpportunityModal
