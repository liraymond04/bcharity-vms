import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import { PlusIcon } from '@heroicons/react/outline'
import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { object, string } from 'zod'
import { isValidHandle, useCreateProfile } from '@lens-protocol/react-web'

interface Props {
  isModal?: boolean
}

const Create: FC<Props> = ({ isModal = false }) => {
  const { t } = useTranslation('common')
  const [avatar, setAvatar] = useState<string>()

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
        if (isValidHandle(username)) await create({ handle: username })
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
      <div className="space-y-1.5">
        <div className="label">{t('Avatar')}</div>
        <div className="space-y-3">
          {avatar && (
            <div>
              <img
                className="w-60 h-60 rounded-lg"
                height={240}
                width={240}
                src={avatar}
                alt={avatar}
              />
            </div>
          )}
        </div>
      </div>
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
