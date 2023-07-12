import React from 'react'

import GradientModal from '@/components/Shared/Modal/GradientModal'

interface IPublishOpportunityModalProps {
  open: boolean
  onClose: () => void
}

const PublishOpportunityModal: React.FC<IPublishOpportunityModalProps> = ({
  open,
  onClose
}) => {
  const onCancel = () => {
    onClose()
  }

  const onSubmit = () => {
    onClose()
  }

  return (
    <GradientModal
      title={'Publish New Volunteer Opportunity'}
      open={open}
      onCancel={onCancel}
      onSubmit={onSubmit}
    >
      <div className="mx-12">
        <p>test</p>
        {/* <FormProvider>
          <Input {...register('activityName', { required: true })} />
        </FormProvider> */}
      </div>
    </GradientModal>
  )
}

export default PublishOpportunityModal
