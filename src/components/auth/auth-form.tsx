"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import type { loginUser, registerUser } from "@/actions/auth";
import { Button, FieldGroup, FormField } from "@/components/ui";
import type {
  LOGIN_SCHEMA,
  REGISTER_SCHEMA_WITH_CONFIRM_PASSWORD,
} from "@/schemas";
import type { LOGIN_FIELDS_DATA, REGISTER_FIELDS_DATA } from "./constants";

type AuthFormData =
  | z.infer<typeof LOGIN_SCHEMA>
  | z.infer<typeof REGISTER_SCHEMA_WITH_CONFIRM_PASSWORD>;

interface AuthFormProps {
  buttonText: string;
  fields: typeof LOGIN_FIELDS_DATA | typeof REGISTER_FIELDS_DATA;
  action: typeof loginUser | typeof registerUser;
  schema: typeof LOGIN_SCHEMA | typeof REGISTER_SCHEMA_WITH_CONFIRM_PASSWORD;
  disabled: boolean;
}

export function AuthForm({
  buttonText,
  fields,
  action,
  schema,
  disabled,
}: AuthFormProps) {
  const [{ error }, formAction, isPending] = useActionState(action, { data: null });

  const { handleSubmit, control } = useForm<AuthFormData>({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(fields.map(({ name }) => [name, ""])),
  });

  const handleSubmitForm = handleSubmit((_, e) =>
    startTransition(() => {
      const formData = new FormData(e?.target);

      formAction(formData);
    }),
  );

  useEffect(() => {
    if (error?.message) toast.error(error.message);
  }, [error]);

  return (
    <form onSubmit={handleSubmitForm}>
      <FieldGroup>
        {fields.map(({ name, ...rest }) => (
          <FormField
            key={name}
            name={name}
            control={control}
            disabled={isPending || disabled}
            {...rest}
          />
        ))}

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || disabled}
        >
          {buttonText}
        </Button>
      </FieldGroup>
    </form>
  );
}
