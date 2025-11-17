import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form'

import { cn } from '@/lib/utils'

const Form = FormProvider

type FormFieldContextValue<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | undefined>(undefined)

const FormItemContext = React.createContext<{ id: string } | undefined>(undefined)

const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  render,
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  const { control } = useFormContext<TFieldValues>()

  return (
    <Controller
      {...props}
      control={control}
      render={(fieldProps) => (
        <FormFieldContext.Provider value={{ name: props.name }}>
          {render(fieldProps)}
        </FormFieldContext.Provider>
      )}
    />
  )
}
FormField.displayName = 'FormField'

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = 'FormItem'

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  if (!fieldContext || !itemContext) {
    throw new Error('useFormField should be used within <FormField> and <FormItem> components')
  }

  const { id } = itemContext

  return {
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
  }
}

const FormLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(({ className, ...props }, ref) => {
  const { formItemId } = useFormField()

  return <LabelPrimitive.Root ref={ref} className={cn('text-sm font-medium text-white', className)} htmlFor={formItemId} {...props} />
})
FormLabel.displayName = LabelPrimitive.Root.displayName

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(({ ...props }, ref) => {
  const { formItemId, formDescriptionId, formMessageId } = useFormField()
  const describedBy = [formDescriptionId, formMessageId].filter(Boolean).join(' ')
  return <Slot ref={ref} id={formItemId} aria-describedby={describedBy} {...props} />
})
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()
  return <p ref={ref} id={formDescriptionId} className={cn('text-sm text-text-muted', className)} {...props} />
})
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, children, ...props }, ref) => {
  const { formMessageId, name } = useFormField()
  const { formState } = useFormContext()
  const error = formState.errors[name as keyof typeof formState.errors]
  const body = children ?? (error ? String((error as { message?: string })?.message ?? 'Invalid input') : null)

  if (!body) {
    return null
  }

  return (
    <p ref={ref} id={formMessageId} className={cn('text-sm text-accent-pink', className)} {...props}>
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

export { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage }
