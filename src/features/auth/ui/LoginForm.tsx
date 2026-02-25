"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { ROUTES } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { FormError } from "@/shared/ui/form-error";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { loginAction } from "../api/actions";
import { type LoginFormData, loginSchema } from "../lib/schemas";

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormData) {
    startTransition(async () => {
      setServerError(() => null);
      const result = await loginAction(data);

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
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link" asChild className="px-0">
            <Link href={ROUTES.auth.signUp}>Sign Up</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
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
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                variant="link"
                asChild
                className="h-auto px-0 py-0 text-xs"
              >
                <Link href={ROUTES.auth.forgotPassword}>
                  Forgot your password?
                </Link>
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            <FormError message={errors.password?.message} />
          </div>
          <FormError message={serverError ?? undefined} />
        </form>
      </CardContent>
      <CardFooter className="border-t flex-col gap-2">
        <Button
          type="submit"
          form="login-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
}
