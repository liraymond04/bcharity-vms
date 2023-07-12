import React from 'react'
import { useForm } from 'react-hook-form'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { Form } from '@/components/UI/Form'
import { Input } from '@/components/UI/Input'

interface IPublishOpportunityModalProps {
  open: boolean
  onClose: () => void
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
  onClose
}) => {
  const form = useForm<IFormProps>()
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register
  } = form

  const onCancel = () => {
    reset()
    onClose()
  }

  const onSubmit = (data: IFormProps) => {
    console.log(data)
    // create new social media post with data
    reset()
    onClose()
  }

  return (
    <GradientModal
      title={'Publish New Volunteer Opportunity'}
      open={open}
      onCancel={onCancel}
      onSubmit={handleSubmit((data) => onSubmit(data))}
    >
      <div className="mx-12">
        <Form
          form={form}
          onSubmit={() => handleSubmit((data) => onSubmit(data))}
        >
          <Input
            label="Volunteer opportunity name"
            placeholder="Medial internship"
            {...register('opportunityName', { required: true })}
          />
          <Input
            label="Date(s)"
            placeholder="yy-mm-dd"
            {...register('dates', { required: true })}
          />
          <Input
            placeholder="5"
            label="Expected number of hours"
            {...register('numHours', { required: true })}
          />
          <Input
            label="Program"
            placeholder="Volunteer program names(s)"
            {...register('program', { required: true })}
          />
          <Input
            label="City/region"
            placeholder="Calgary"
            {...register('program', { required: true })}
          />
          <Input
            label="Category"
            placeholder="Healthcare"
            {...register('category', { required: true })}
          />
          <Input
            label="Website (leave empty if not linking to external opportunity)"
            placeholder="https://ecssen.ca/opportunity-link"
            {...register('website')}
          />
          <Input
            label="Activity Description"
            placeholder="Tell us more about this volunteer opportunity"
            resizeable
            {...register('description', { required: true })}
          />
        </Form>
      </div>
    </GradientModal>
  )
}

export default PublishOpportunityModal
