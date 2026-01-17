"use client";

import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldLabel,
  Input,
} from "@/components/ui";

interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  autoComplete,
  disabled = false,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

          <Input
            {...field}
            id={field.name}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
          />

          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}
