import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import React from 'react'
import { cn } from '../util/cn'
import { AvatarInput } from './avatar'
import { Button } from './button'
import { Checkbox } from './checkbox'
import { FieldDescription, FieldError, FieldLabel } from './field'
import { NumberInput } from './number-input'
import { OTPInput } from './otp-input'
import { Select } from './select'
import { Switch } from './switch'
import { TextArea } from './text-area'
import { TextInput } from './text-input'

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

function AvatarField({
  className,
  label,
  description,
  ...props
}: React.ComponentProps<typeof AvatarInput> & {
  label?: React.ReactNode
  description?: React.ReactNode
}) {
  const field = useFieldContext<string>()
  return (
    <div className={cn('flex flex-col items-start gap-1', className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <AvatarInput
        defaultValue={field.options.defaultValue}
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.setValue(value)}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {field.state.meta.errors.length > 0 && <FieldError>{field.state.meta.errors[0]}</FieldError>}
    </div>
  )
}

function CheckboxField({
  className,
  label,
  description,
  ...props
}: React.ComponentProps<typeof Checkbox> & {
  label?: React.ReactNode
  description?: React.ReactNode
}) {
  const field = useFieldContext<boolean>()
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-start gap-2">
        <Checkbox
          defaultChecked={field.options.defaultValue}
          name={field.name}
          checked={field.state.value}
          onCheckedChange={(checked) => field.setValue(checked)}
          {...props}
        />
        <div className="flex flex-col">
          {label && <FieldLabel>{label}</FieldLabel>}
          {description && <FieldDescription>{description}</FieldDescription>}
        </div>
      </div>
      {field.state.meta.errors.length > 0 && <FieldError>{field.state.meta.errors[0]}</FieldError>}
    </div>
  )
}

function NumberInputField({
  className,
  label,
  description,
  ...props
}: React.ComponentProps<typeof NumberInput> & {
  label?: React.ReactNode
  description?: React.ReactNode
}) {
  const field = useFieldContext<string>()
  return (
    <div className={cn('flex flex-col items-start gap-1', className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <NumberInput
        defaultValue={field.options.defaultValue}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.setValue(e.currentTarget.value)}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {field.state.meta.errors.length > 0 && <FieldError>{field.state.meta.errors[0]}</FieldError>}
    </div>
  )
}

function OTPField({
  className,
  label,
  description,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  label?: React.ReactNode
  description?: React.ReactNode
}) {
  const field = useFieldContext<string>()
  return (
    <div className={cn('flex flex-col items-start gap-1', className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <OTPInput
        defaultValue={field.options.defaultValue}
        name={field.name}
        value={field.state.value}
        onChange={(value) => field.setValue(value)}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {field.state.meta.errors.length > 0 && <FieldError>{field.state.meta.errors[0]}</FieldError>}
    </div>
  )
}

function SelectField({
  className,
  label,
  description,
  ...props
}: React.ComponentProps<typeof Select> & {
  className?: string
  label?: React.ReactNode
  description?: React.ReactNode
}) {
  const field = useFieldContext<string>()
  return (
    <div className={cn('flex flex-col items-start gap-1', className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Select
        defaultValue={field.options.defaultValue}
        name={field.name}
        value={field.state.value}
        onValueChange={(value: any) => field.setValue(value)}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {field.state.meta.errors.length > 0 && <FieldError>{field.state.meta.errors[0]}</FieldError>}
    </div>
  )
}

function SwitchField({
  className,
  label,
  description,
  ...props
}: React.ComponentProps<typeof Switch> & {
  label?: React.ReactNode
  description?: React.ReactNode
}) {
  const field = useFieldContext<boolean>()
  return (
    <div className={cn('flex items-center justify-between gap-1', className)}>
      <div className="flex flex-col">
        {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
        {description && <FieldDescription>{description}</FieldDescription>}
        {field.state.meta.errors.length > 0 && (
          <FieldError>{field.state.meta.errors[0]}</FieldError>
        )}
      </div>
      <Switch
        checked={field.state.value}
        defaultChecked={field.options.defaultValue}
        id={field.name}
        name={field.name}
        onCheckedChange={(checked) => field.setValue(checked)}
        {...props}
      />
    </div>
  )
}

function TextInputField({
  className,
  label,
  description,
  ...props
}: React.ComponentProps<typeof TextInput> & {
  label?: React.ReactNode
  description?: React.ReactNode
}) {
  const field = useFieldContext<string>()
  return (
    <div className={cn('flex flex-col items-start gap-1', className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <TextInput
        defaultValue={field.options.defaultValue}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.setValue(e.currentTarget.value)}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {field.state.meta.errors.length > 0 && <FieldError>{field.state.meta.errors[0]}</FieldError>}
    </div>
  )
}

function TextAreaField({
  className,
  label,
  description,
  ...props
}: React.ComponentProps<typeof TextArea> & {
  label?: React.ReactNode
  description?: React.ReactNode
}) {
  const field = useFieldContext<string>()
  return (
    <div className={cn('flex flex-col items-start gap-1', className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <TextArea
        defaultValue={field.options.defaultValue}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.setValue(e.currentTarget.value)}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {field.state.meta.errors.length > 0 && <FieldError>{field.state.meta.errors[0]}</FieldError>}
    </div>
  )
}

function SubmitButton(props: React.ComponentProps<typeof Button>) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.canSubmit}>
      {(canSubmit) => <Button type="submit" disabled={!canSubmit} {...props} />}
    </form.Subscribe>
  )
}

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    AvatarField,
    CheckboxField,
    NumberInputField,
    OTPField,
    SelectField,
    SwitchField,
    TextInputField,
    TextAreaField,
  },
  formComponents: {
    SubmitButton,
  },
})
