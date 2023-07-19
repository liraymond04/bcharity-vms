import { PostFragment, ProfileFragment } from '@lens-protocol/client'
import React, { useEffect, useState } from 'react'

import GradientModal from '@/components/Shared/Modal/GradientModal'
import { Input } from '@/components/UI/Input'
import { Spinner } from '@/components/UI/Spinner'
import { TextArea } from '@/components/UI/TextArea'
import checkAuth from '@/lib/lens-protocol/checkAuth'
import lensClient from '@/lib/lens-protocol/lensClient'
import usePostData from '@/lib/lens-protocol/usePostData'
import { PostTags } from '@/lib/types'

import Error from './Error'
import { IPublishOpportunityFormProps } from './PublishOpportunityModal'

interface IDeleteOpportunityModalProps {
  open: boolean
  onClose: (shouldRefetch: boolean) => void
  id: string
  publisher: ProfileFragment | null
  values: IPublishOpportunityFormProps
}

const DeleteOpportunityModal: React.FC<IDeleteOpportunityModalProps> = ({
  open,
  onClose,
  id,
  publisher,
  values
}) => {
  const {
    data: postData,
    error: dataFetchError,
    loading
  } = usePostData({
    profileId: publisher?.id ?? '',
    metadata: {
      tags: { all: [PostTags.OrgPublish.Opportuntiy] }
    }
  })

  const [publicationIds, setPublicationIds] = useState<string[]>([])

  const [pending, setPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const ids = postData
      .filter(
        (post) =>
          post.__typename === 'Post' && !!post.metadata.attributes[1].value
      )
      .filter(
        (post) => (post as PostFragment).metadata.attributes[1].value === id
      )
      .map((post) => post.id)

    console.log(ids)

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

  const isReady = () => !pending && !loading
  const hasError = () => !!dataFetchError || !!errorMessage
  const getErrorMessage = () => {
    if (errorMessage) return errorMessage
    return dataFetchError
  }

  return (
    <GradientModal
      title={'Delete Volunteer Opportunity'}
      open={open}
      onCancel={onCancel}
      onSubmit={onSubmit}
      submitDisabled={!isReady()}
    >
      <div className="mx-12">
        {isReady() ? (
          <>
            <Input
              label="Volunteer opportunity name"
              defaultValue={values.opportunityName}
              disabled
            />
            <Input
              label="Date(s)"
              type="date"
              defaultValue={values.dates}
              disabled
            />
            <Input
              label="Expected number of hours"
              defaultValue={values.numHours}
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

        {hasError() && (
          <Error
            message={`An error occured: ${getErrorMessage()}. Please try again.`}
          />
        )}
      </div>
    </GradientModal>
  )
}

export default DeleteOpportunityModal
