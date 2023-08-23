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
      case 'validate': {
        return error.message?.toString() ?? 'Unknown error'
      }
      case 'city': {
        return 'City not recognized'
      }
      default:
        return error.message?.toString() ?? 'Unknown error'
    }
  }

  return (
    <div className="mt-1 text-sm font-medium text-red-500">
      {getErrorMessage()}
    </div>
  )
}

/**
 * Properties of {@link Form} that extends react-hook-form FieldValues
 */
export interface FormProps<T extends FieldValues = Record<string, unknown>>
  extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  /**
   * React hook form object to use
   */
  form: UseFormReturn<T>
  /**
   * Submit handler to run when form is submitted
   */
  onSubmit: SubmitHandler<T>
  /**
   * Class names and tailwind styles passed to the component
   */
  className?: string
}

/**
 * Component that wraps a react-hook-form Form
 */
export const Form = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  className = ''
}: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset
          className={`flex flex-col ${className} min-w-0`}
          disabled={form.formState.isSubmitting}
        >
          {children}
        </fieldset>
      </form>
    </FormProvider>
  )
}
