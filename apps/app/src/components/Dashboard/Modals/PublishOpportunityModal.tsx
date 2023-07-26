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
import { TextArea } from '@/components/UI/TextArea'
import { APP_NAME } from '@/constants'
import getUserLocale from '@/lib/getUserLocale'
import uploadToIPFS from '@/lib/ipfs/ipfsUpload'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import createPost from '@/lib/lens-protocol/createPost'
import {
  MetadataVersion,
  OpportunityMetadataAttributeInput,
  PostTags
} from '@/lib/types'

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

export const createPublishAttributes = (
  id: string,
  data: IPublishOpportunityFormProps
) => {
  const attributes: OpportunityMetadataAttributeInput[] = [
    {
      traitType: 'type',
      displayType: PublicationMetadataDisplayTypes.String,
      value: PostTags.OrgPublish.Opportuntiy
    },
    {
      traitType: 'version',
      displayType: PublicationMetadataDisplayTypes.String,
      value: MetadataVersion.OpportunityMetadataVersion['1.0.0']
    },
    {
      traitType: 'opportunity_id',
      displayType: PublicationMetadataDisplayTypes.String,
      value: id
    },
    {
      traitType: 'name',
      displayType: PublicationMetadataDisplayTypes.String,
      value: data.name
    },
    {
      traitType: 'startDate',
      displayType: PublicationMetadataDisplayTypes.String,
      value: data.startDate
    },
    {
      traitType: 'endDate',
      displayType: PublicationMetadataDisplayTypes.String,
      value: data.endDate
    },
    {
      traitType: 'hoursPerWeek',
      displayType: PublicationMetadataDisplayTypes.String,
      value: data.hoursPerWeek
    },
    {
      traitType: 'category',
      displayType: PublicationMetadataDisplayTypes.String,
      value: data.category
    },
    {
      traitType: 'website',
      displayType: PublicationMetadataDisplayTypes.String,
      value: data.website
    },
    {
      traitType: 'description',
      displayType: PublicationMetadataDisplayTypes.String,
      value: data.description
    },
    {
      traitType: 'imageUrl',
      displayType: PublicationMetadataDisplayTypes.String,
      value: data.imageUrl
    }
  ]

  return attributes
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
  const [endDateDisabled, setEndDateDisabled] = useState<boolean>(true)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)

  const form = useForm<IPublishOpportunityFormProps>()

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

    if (!publisher) {
      setErrorMessage('No publisher provided')
      setError(true)
      setIsPending(false)
      return
    }

    const imageUrl = image ? await uploadToIPFS(image) : null
    data.imageUrl = imageUrl ? imageUrl : ''

    const attributes = createPublishAttributes(v4(), data)

    const metadata: PublicationMetadataV2Input = {
      version: '2.0.0',
      metadata_id: v4(),
      content: `#${PostTags.OrgPublish.Opportuntiy}`,
      locale: getUserLocale(),
      tags: [PostTags.OrgPublish.Opportuntiy],
      mainContentFocus: PublicationMainFocus.TextOnly,
      name: `${PostTags.OrgPublish.Opportuntiy} by ${publisher?.handle}`,
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
              type="date"
              placeholder="yyyy-mm-dd"
              hasTick
              change={() => {
                form.setValue('endDate', '')
                setEndDateDisabled(!endDateDisabled)
              }}
              disabled={!endDateDisabled}
              {...register('endDate', {})}
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
              {...register('website')}
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
