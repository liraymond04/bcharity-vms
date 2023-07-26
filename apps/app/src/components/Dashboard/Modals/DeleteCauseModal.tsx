import {
  PostFragment,
  ProfileFragment,
  PublicationFragment
} from '@lens-protocol/client'
import React, { useEffect, useState } from 'react'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import lensClient from '@/lib/lens-protocol/lensClient'

import Error from './Error'
import { IPublishCauseFormProps } from './PublishCauseModal'

interface IDeleteCauseModalProps {
  open: boolean
  onClose: (shouldRefetch: boolean) => void
  id: string
  publisher: ProfileFragment | null
  values: IPublishCauseFormProps
  postData: PublicationFragment[]
}

const DeleteCauseModal: React.FC<IDeleteCauseModalProps> = ({
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
    const ids = postData
      .filter(
        (post) =>
          post.__typename === 'Post' && !!post.metadata.attributes[2].value
      )
      .filter(
        (post) => (post as PostFragment).metadata.attributes[2].value === id
      )
      .map((post) => post.id)

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
  console.log('delte', postData)
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
            <Input label="Name" defaultValue={values.name} disabled />

            <Input label="Categiry" defaultValue={values.category} disabled />

            <Input
              label="Currency"
              defaultValue={values.selectedCurrency}
              disabled
            />
            <Input
              label="Contribution"
              defaultValue={values.contribution}
              disabled
            />
            <Input label="Funding Goal" defaultValue={values.goal} disabled />
            <Input label="Recipient" defaultValue={values.recipient} disabled />
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

export default DeleteCauseModal
