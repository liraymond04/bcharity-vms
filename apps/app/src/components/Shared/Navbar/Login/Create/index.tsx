import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import { PlusIcon } from '@heroicons/react/outline'
import { isValidHandle, useCreateProfile } from '@lens-protocol/react-web'
import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { object, string } from 'zod'

interface Props {
  isModal?: boolean
}

const Create: FC<Props> = ({ isModal = false }) => {
  const { t } = useTranslation('common')
  const [success, setSuccess] = useState<boolean>(false)

  const { execute: create, error, isPending } = useCreateProfile()

  const newUserSchema = object({
    handle: string()
      .min(2, { message: 'Handle should be atleast 2 characters' })
      .max(31, { message: 'Handle should be less than 32 characters' })
      .regex(/^[a-z0-9]+$/, {
        message: 'Handle should only contain alphanumeric characters'
      })
  })

  const form = useZodForm({
    schema: newUserSchema
  })

  return (
    <Form
      form={form}
      className="space-y-4"
      onSubmit={async ({ handle }) => {
        const username = handle.toLowerCase()
        if (isValidHandle(username)) {
          const result = await create({ handle: username })
          if (result.isSuccess()) {
            setSuccess(true)
          }
        }
      }}
    >
      {error && (
        <ErrorMessage
          className="mb-3"
          title="Create profile failed!"
          error={{
            name: 'Create profile failed!',
            message: error.message
          }}
        />
      )}
      {success && (
        <div
          className={`bg-green-50 dark:bg-green=-900 dark:bg-opacity-10 border-2 border-green-500 border-opacity-50 p-4 space-y-1 rounded-xl`}
        >
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
            Profile creation successful!
          </h3>
          <div className="text-sm text-green-700 dark:text-green-200">
            You can close the modal and try signing in again to use your new
            profile
          </div>
        </div>
      )}
      {isModal && (
        <div className="mb-2 space-y-4">
          <img
            className="w-10 h-10"
            height={40}
            width={40}
            src="/logo.svg"
            alt="Logo"
          />
          <div className="text-xl font-bold">{t('Signup Bcharity')}</div>
        </div>
      )}
      <Input
        label={t('Handle')}
        type="text"
        placeholder="gavin"
        {...form.register('handle')}
      />
      <Button
        className="ml-auto"
        type="submit"
        disabled={isPending}
        icon={
          isPending ? <Spinner size="xs" /> : <PlusIcon className="w-4 h-4" />
        }
      >
        {t('Signup')}
      </Button>
    </Form>
  )
}

export default Create
