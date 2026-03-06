"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import { forgotPasswordAction } from "../api/actions";
import {
  type ForgotPasswordFormData,
  forgotPasswordSchema,
} from "../lib/schemas";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  function onSubmit(data: ForgotPasswordFormData) {
    startTransition(async () => {
      setServerError(() => null);
      setIsSuccess(() => false);
      const result = await forgotPasswordAction(data);

      if (result.error) {
        setServerError(() => result.error);
        return;
      }

      setIsSuccess(() => true);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          {!isSuccess
            ? "Enter your email and we will send you a reset link"
            : "Check your email for a password reset link."}
        </CardDescription>
      </CardHeader>
      {!isSuccess && (
        <>
          <CardContent>
            <form
              id="forgot-password-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  {...register("email")}
                />
                <FormError message={errors.email?.message} />
              </div>
              <FormError message={serverError ?? undefined} />
            </form>
          </CardContent>
          <CardFooter className="border-t flex-col gap-3">
            <Button
              type="submit"
              form="forgot-password-form"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Send reset link"}
            </Button>
            <p className="text-muted-foreground text-sm">
              Remember your password?{" "}
              <Button
                variant="link"
                asChild
                className="h-auto p-0 font-medium"
              >
                <Link href={ROUTES.auth.login}>Back to login</Link>
              </Button>
            </p>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
