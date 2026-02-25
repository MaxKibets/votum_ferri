"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { ROUTES } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { FormError } from "@/shared/ui/form-error";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { updatePasswordAction } from "../api/actions";
import {
  type UpdatePasswordFormData,
  updatePasswordSchema,
} from "../lib/schemas";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  function onSubmit(data: UpdatePasswordFormData) {
    startTransition(async () => {
      setServerError(() => null);
      const result = await updatePasswordAction(data);

      if (result.error) {
        setServerError(() => result.error);
        return;
      }

      router.push(ROUTES.protected);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update your password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="update-password-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
            <FormError message={errors.password?.message} />
          </div>
          <FormError message={serverError ?? undefined} />
        </form>
      </CardContent>
      <CardFooter className="border-t">
        <Button
          type="submit"
          form="update-password-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Update password"}
        </Button>
      </CardFooter>
    </Card>
  );
}
