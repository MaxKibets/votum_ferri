"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginUser, registerUser } from "@/actions/auth";
import { Button, FieldGroup, FormField } from "@/components/ui";
import { DASHBOARD_PATH } from "@/constants/routes";
import { LOGIN_SCHEMA, REGISTER_SCHEMA_WITH_CONFIRM_PASSWORD } from "@/constants/authValidationSchemas";
import { LOGIN_FIELDS_DATA, REGISTER_FIELDS_DATA } from "./constants";

type AuthFormData = z.infer<typeof LOGIN_SCHEMA> | z.infer<typeof REGISTER_SCHEMA_WITH_CONFIRM_PASSWORD>;

interface AuthFormProps {
  buttonText: string;
  fields: typeof LOGIN_FIELDS_DATA | typeof REGISTER_FIELDS_DATA;
  action: typeof loginUser | typeof registerUser;
  schema: typeof LOGIN_SCHEMA | typeof REGISTER_SCHEMA_WITH_CONFIRM_PASSWORD;
}

export function AuthForm({ buttonText, fields, action, schema }: AuthFormProps) {
  const router = useRouter();

  const [{ data, error }, formAction, isPending] = useActionState(action, {
    data: null,
    error: null,
  });

  const { handleSubmit, control } = useForm<AuthFormData>({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(fields.map(({ name }) => [name, ""])),
  });

  const handleSubmitForm = handleSubmit((payload: AuthFormData) =>
    startTransition(() => {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      formAction(formData);
    }),
  );

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }

    if (data?.success) {
      router.push(DASHBOARD_PATH);
    }
  }, [error, data, router]);

  return (
    <form onSubmit={handleSubmitForm}>
      <FieldGroup>
        {fields.map(({ name, ...rest }) => (
          <FormField key={name} name={name} control={control} disabled={isPending} {...rest} />
        ))}

        <Button type="submit" className="w-full" disabled={isPending}>
          {buttonText}
        </Button>
      </FieldGroup>
    </form>
  );
}
