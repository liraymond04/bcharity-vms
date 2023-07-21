import { zodResolver } from '@hookform/resolvers/zod'
import React, { ComponentProps, FC } from 'react'
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
  UseFormProps,
  UseFormReturn
} from 'react-hook-form'
import { TypeOf, ZodSchema } from 'zod'

interface UseZodFormProps<T extends ZodSchema<FieldValues>>
  extends UseFormProps<TypeOf<T>> {
  schema: T
}

export const useZodForm = <T extends ZodSchema<FieldValues>>({
  schema,
  ...formConfig
}: UseZodFormProps<T>) => {
  return useForm({
    ...formConfig,
    resolver: zodResolver(schema)
  })
}

interface FieldErrorProps {
  name?: string
}

export const FieldError: FC<FieldErrorProps> = ({ name }) => {
  const {
    formState: { errors }
  } = useFormContext()
  if (!name) return null
  const error = errors[name]
  if (!error) return null

  const getErrorMessage = () => {
    switch (error.type) {
      case 'required':
        return 'This field is required'
      case 'maxLength':
        return 'Length exceeds maximum number of characters'
      case 'pattern': {
        return error.message?.toString() ?? 'Unknown error'
      }
      default:
        return 'Unknown error'
    }
  }

  return (
    <div className="mt-1 text-sm font-medium text-red-500">
      {getErrorMessage()}
    </div>
  )
}

interface Props<T extends FieldValues = Record<string, unknown>>
  extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  form: UseFormReturn<T>
  onSubmit: SubmitHandler<T>
  className?: string
}

export const Form = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  className = ''
}: Props<T>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset
          className={`flex flex-col ${className}`}
          disabled={form.formState.isSubmitting}
        >
          {children}
        </fieldset>
      </form>
    </FormProvider>
  )
}
