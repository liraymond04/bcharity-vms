import { ProfileFragment, PublicationFragment } from '@lens-protocol/client'
import React, { useEffect, useState } from 'react'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import lensClient from '@/lib/lens-protocol/lensClient'
import getOpportunityMetadata from '@/lib/metadata/get/getOpportunityMetadata'

import Error from './Error'
import { IPublishOpportunityFormProps } from './PublishOpportunityModal'

interface IDeleteOpportunityModalProps {
  open: boolean
  onClose: (shouldRefetch: boolean) => void
  id: string
  publisher: ProfileFragment | null
  values: IPublishOpportunityFormProps
  postData: PublicationFragment[]
}

const DeleteOpportunityModal: React.FC<IDeleteOpportunityModalProps> = ({
  open,
  onClose,
  id,
  publisher,
  values,
  postData
}) => {
  const [publicationIds, setPublicationIds] = useState<string[]>([])

  const [pending, setPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const ids = getOpportunityMetadata(postData).map((p) => p.id)

    setPublicationIds(ids)
  }, [id, postData])

  const onCancel = () => {
    onClose(false)
  }

  const onSubmit = () => {
    setErrorMessage('')
    setPending(false)

    if (!publisher) {
      setErrorMessage('No publisher provided')
      setPending(false)
      return
    }

    checkAuth(publisher.ownedBy)
      .then(() =>
        Promise.all(
          publicationIds.map((id) =>
            lensClient().publication.hide({ publicationId: id })
          )
        )
      )
      .then((res) => {
        res.map((r) => {
          if (r.isFailure()) {
            throw r.error.message
          }
        })
      })
      .then(() => {
        onClose(true)
      })
      .catch((e) => {
        setErrorMessage(e.message)
      })
      .finally(() => {
        setPending(false)
      })
  }

  return (
    <GradientModal
      title={'Delete Volunteer Opportunity'}
      open={open}
      onCancel={onCancel}
      onSubmit={onSubmit}
      submitDisabled={pending}
    >
      <div className="mx-12">
        {!pending ? (
          <>
            <Input
              label="Volunteer opportunity name"
              defaultValue={values.name}
              disabled
            />
            <Input
              label="Start Date"
              type="date"
              defaultValue={values.startDate}
              disabled
            />
            <Input
              label="End Date"
              type="date"
              defaultValue={values.endDate}
              disabled
            />
            <Input
              label="Expected number of hours"
              defaultValue={values.hoursPerWeek}
              disabled
            />
            <Input label="Category" defaultValue={values.category} disabled />
            <Input
              label="Website (leave empty if not linking to external opportunity)"
              defaultValue={values.website}
              disabled
            />
            <TextArea
              label="Activity Description"
              defaultValue={values.description}
              disabled
            />
          </>
        ) : (
          <Spinner />
        )}

        {!!errorMessage && (
          <Error
            message={`An error occured: ${errorMessage}. Please try again.`}
          />
        )}
      </div>
    </GradientModal>
  )
}

export default DeleteOpportunityModal
