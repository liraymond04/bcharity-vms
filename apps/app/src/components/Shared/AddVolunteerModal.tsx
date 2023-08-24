import { PlusCircleIcon } from '@heroicons/react/outline'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Spinner } from '@/components/UI'
import { Input } from '@/components/UI'
import { checkAuth, getProfile } from '@/lib/lens-protocol'
import { buildMetadata, PostTags } from '@/lib/metadata'
import { ApplicationMetadataRecord } from '@/lib/metadata/ApplicationMetadata'
import { MetadataVersion } from '@/lib/types'
import { useAppPersistStore } from '@/store/app'

import ErrorComponent from '../Dashboard/Modals/Error'
import { Button } from '../UI/Button'
import { Form } from '../UI/Form'
import { Modal } from '../UI/Modal'

export interface IAddVolunteerModalProps {}

export interface IAddVolunteerFormProps {
  handle: string
}

const AddVolunteerModal: FC<IAddVolunteerModalProps> = ({}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'components.dashboard.organization.management.add-volunteer'
  })
  const { t: e } = useTranslation('common', {
    keyPrefix: 'errors'
  })

  const [error, setModalError] = useState<Error>()

  const { currentUser } = useAppPersistStore()

  const [showModal, setShowModal] = useState<boolean>(false)

  const [handle, setHandle] = useState<string>()

  const form = useForm<IAddVolunteerFormProps>()

  const {
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    clearErrors
  } = form

  const onCancel = () => {
    reset()
    setShowModal(false)
    setModalError(undefined)
  }

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = async (formData: IAddVolunteerFormProps) => {
    if (handle === undefined) {
      setError('handle', {
        type: 'required',
        message: 'A handle is required.'
      })
      return
    }
    const result = await getProfile({ handle: handle })

    if (result === null) {
      setError('handle', {
        type: 'invalid',
        message: 'This handle is invalid.'
      })
      console.log(result)
      return
    }

    setModalError(undefined)
    setIsLoading(true)

    try {
      if (!currentUser) throw Error(e('profile-null'))
      console.log(formData)

      await checkAuth(currentUser.ownedBy)

      const metadata = buildMetadata<ApplicationMetadataRecord>(
        currentUser,
        [PostTags.Application.Apply],
        {
          version: MetadataVersion.ApplicationMetadataVersion['1.0.0'],
          type: PostTags.Application.Apply,
          resume: '',
          description: '',
          manual: 'true'
        }
      )

      setShowModal(false)
      setHandle(undefined)
    } catch (error) {
      if (error instanceof Error) {
        setModalError(error)
      }
    }
    setIsLoading(false)
  }

  return (
    <div>
      <Modal show={showModal} title="" size="md" onClose={onCancel}>
        <Form
          form={form}
          onSubmit={() => handleSubmit((data) => onSubmit(data))}
        >
          <div className="px-10 py-4 flex flex-col space-y-4">
            <div className="flex flex-row ">
              <div
                className="text-purple-500 text-1xl font-bold"
                suppressHydrationWarning
              >
                {t('title')}
              </div>
            </div>
            <div className="flex items-center justify-left">
              <Input label={t('handle')} type="text" placeholder="@test.test" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            {' '}
            <Button
              type="submit"
              icon={isLoading && <Spinner size="sm" />}
              disabled={isLoading}
              onClick={handleSubmit((data) => onSubmit(data))}
              suppressHydrationWarning
            >
              {t('submit')}
            </Button>
          </div>
        </Form>
        <div className="m-4">
          {error && (
            <ErrorComponent
              message={`${e('generic-front')}${error.message}${e(
                'generic-back'
              )}`}
            />
          )}
        </div>
      </Modal>
      <Button
        icon={<PlusCircleIcon className="w-5 h-5" />}
        onClick={() => {
          setShowModal(true)
        }}
      >
        <span className="mr-2 mt-1 font-bold">{t('title')}</span>
      </Button>
    </div>
  )
}

export default AddVolunteerModal
