import { ProfileFragment } from '@lens-protocol/client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { Form } from '@/components/UI/Form'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import uploadToIPFS from '@/lib/ipfs/ipfsUpload'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import createPost from '@/lib/lens-protocol/createPost'
import { buildMetadata, OpportunityMetadataFields } from '@/lib/metadata'
import { PostTag } from '@/lib/metadata/PostTags'
import { MetadataVersion, PostTags } from '@/lib/types'

import Error from './Error'
import { IPublishOpportunityFormProps } from './PublishOpportunityModal'

interface IPublishOpportunityModalProps {
  open: boolean
  onClose: (shouldRefetch: boolean) => void
  id: string
  publisher: ProfileFragment | null
  defaultValues: IPublishOpportunityFormProps
}

const ModifyOpportunityModal: React.FC<IPublishOpportunityModalProps> = ({
  open,
  onClose,
  id,
  publisher,
  defaultValues
}) => {
  const [isPending, setIsPending] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)
  const [endDateDisabled, setEndDateDisabled] = useState<boolean>(true)
  const form = useForm<IPublishOpportunityFormProps>({ defaultValues })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues])

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors }
  } = form

  const onCancel = () => {
    reset(defaultValues)
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

    const imageUrl = image ? await uploadToIPFS(image) : defaultValues.imageUrl

    const metadata = buildMetadata<OpportunityMetadataFields>(
      publisher,
      [PostTag.PublishOpportunity],
      {
        version: MetadataVersion.OpportunityMetadataVersion['1.0.0'],
        type: PostTags.OrgPublish.Opportunity,
        opportunity_id: id,
        ...formData,
        imageUrl
      }
    )

    checkAuth(publisher.ownedBy)
      .then(() =>
        createPost(
          publisher,
          metadata,
          {
            freeCollectModule: {
              followerOnly: false
            }
          },
          { followerOnlyReferenceModule: false }
        )
      )
      .then((res) => {
        if (res.isFailure()) {
          setError(true)
          setErrorMessage(res.error.message)
          throw res.error.message
        }
      })
      .then(() => {
        reset(formData)
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
              error={!!errors.endDate?.type}
              {...register('startDate', {
                required: true
              })}
            />
            <Input
              label="End Date"
              type="date"
              hasTick
              placeholder="yyyy-mm-dd"
              change={() => {
                form.setValue('endDate', '')
                setEndDateDisabled(!endDateDisabled)
              }}
              disabled={!endDateDisabled}
              error={!!errors.endDate?.type}
              {...register('endDate', {})}
            />
            <Input
              label="Expected number of hours"
              placeholder="5.5"
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

export default ModifyOpportunityModal
