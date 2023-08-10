import { ProfileFragment as Profile } from '@lens-protocol/client'
import { useStorageUpload } from '@thirdweb-dev/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { v4 } from 'uuid'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { Form } from '@/components/UI/Form'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import useCreatePost from '@/lib/lens-protocol/useCreatePost'
import { buildMetadata, OpportunityMetadataRecord } from '@/lib/metadata'
import { PostTags } from '@/lib/metadata/PostTags'
import { MetadataVersion } from '@/lib/types'

import Error from './Error'

export interface IPublishOpportunityFormProps {
  name: string
  startDate: string
  endDate: string
  hoursPerWeek: string
  category: string
  website: string
  description: string
  imageUrl: string
}

export const emptyPublishFormData: IPublishOpportunityFormProps = {
  name: '',
  startDate: '',
  endDate: '',
  hoursPerWeek: '',
  category: '',
  website: '',
  description: '',
  imageUrl: ''
}

interface IPublishOpportunityModalProps {
  open: boolean
  onClose: (shouldRefetch: boolean) => void
  publisher: Profile | null
}

const PublishOpportunityModal: React.FC<IPublishOpportunityModalProps> = ({
  open,
  onClose,
  publisher
}) => {
  const { createPost } = useCreatePost()

  const { mutateAsync: upload } = useStorageUpload()

  const [endDateDisabled, setEndDateDisabled] = useState<boolean>(true)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)

  const form = useForm<IPublishOpportunityFormProps>()

  const {
    handleSubmit,
    reset,
    resetField,
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

  const onSubmit = async (formData: IPublishOpportunityFormProps) => {
    setError(false)
    setIsPending(true)

    if (!publisher) {
      setErrorMessage('No publisher provided')
      setError(true)
      setIsPending(false)
      return
    }

    const imageUrl = image ? (await upload({ data: [image] }))[0] : ''

    const metadata = buildMetadata<OpportunityMetadataRecord>(
      publisher,
      [PostTags.OrgPublish.Opportunity],
      {
        version: MetadataVersion.OpportunityMetadataVersion['1.0.1'],
        type: PostTags.OrgPublish.Opportunity,
        id: v4(),
        ...formData,
        imageUrl
      }
    )

    try {
      await checkAuth(publisher.ownedBy)
      await createPost(publisher, metadata)

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
              placeholder="Medical internship"
              error={!!errors.name?.type}
              {...register('name', {
                required: true,
                maxLength: 100
              })}
            />
            <Input
              label="Start Date"
              type="date"
              placeholder="yyyy-mm-dd"
              error={!!errors.startDate?.type}
              {...register('startDate', {
                required: true
              })}
            />
            <Input
              label="End Date"
              type="endDate"
              placeholder="yyyy-mm-dd"
              disabled={!endDateDisabled}
              error={!!errors.endDate?.type}
              {...register('endDate', {})}
              onChange={(e) => {
                if (e.target.value === 'on') {
                  resetField('endDate')
                  setEndDateDisabled(!endDateDisabled)
                }
              }}
            />
            <Input
              label="Expected number of hours"
              type="number"
              placeholder="5.5"
              step="0.1"
              min="0.1"
              error={!!errors.hoursPerWeek?.type}
              {...register('hoursPerWeek', {
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
              {...register('category', { required: true, maxLength: 40 })}
            />
            <Input
              label="Website (leave empty if not linking to external opportunity)"
              placeholder="https://ecssen.ca/opportunity-link"
              error={!!errors.website?.type}
              {...register('website', {
                validate: (url) => {
                  return (
                    url == '' ||
                    validUrl(url) ||
                    'You must enter a valid website'
                  )
                }
              })}
            />
            <TextArea
              label="Activity Description"
              placeholder="Tell us more about this volunteer opportunity"
              error={!!errors.description?.type}
              {...register('description', { required: true, maxLength: 250 })}
            />
            <Input
              label="Image (optional): "
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
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

export default PublishOpportunityModal
