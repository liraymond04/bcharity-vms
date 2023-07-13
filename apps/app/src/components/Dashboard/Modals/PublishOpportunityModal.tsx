import {
  CollectPolicyType,
  ContentFocus,
  CreatePostArgs,
  ProfileOwnedByMe,
  ReferencePolicyType,
  useCreatePost
} from '@lens-protocol/react-web'
import React from 'react'
import { useForm } from 'react-hook-form'
import { v4 } from 'uuid'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { Form } from '@/components/UI/Form'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import uploadToIPFS from '@/lib/ipfsUpload'

import Error from './Error'

interface IPublishOpportunityModalProps {
  open: boolean
  onClose: (shouldRefetch: boolean) => void
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
    upload: uploadToIPFS
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
    onClose(false)
  }

  const onSubmit = async (data: IFormProps) => {
    const metadata = {
      'opportunity-id': v4(),
      name: data.opportunityName,
      date: data.dates,
      hours: data.numHours,
      program: data.program,
      city: data.region,
      category: data.category,
      website: data.website,
      description: data.description
    }

    const postData: CreatePostArgs = {
      content: JSON.stringify(metadata),
      contentFocus: ContentFocus.TEXT_ONLY,
      locale: 'en',
      collect: {
        type: CollectPolicyType.NO_COLLECT
      },
      reference: {
        type: ReferencePolicyType.ANYONE
      },
      tags: ['ORG_PUBLISH_OPPORTUNITY']
    }

    execute(postData)
      .then((result) => {
        if (result.isSuccess()) {
          reset()
          onClose(true)
        } else {
          throw result.error
        }
      })
      .catch((err) => {
        console.error('Create post error:', err)
      })
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

        {lensError && (
          <Error
            message={`An error occured: ${lensError.message}. Please try again.`}
          />
        )}
      </div>
    </GradientModal>
  )
}

export default PublishOpportunityModal
