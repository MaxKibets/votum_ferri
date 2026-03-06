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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { FormError } from "@/shared/ui/form-error";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { signUpAction } from "../api/actions";
import { type SignUpFormData, signUpSchema } from "../lib/schemas";

export function SignUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  function onSubmit(data: SignUpFormData) {
    startTransition(async () => {
      setServerError(() => null);
      const result = await signUpAction(data);

      if (result.error) {
        setServerError(() => result.error);
        return;
      }

      router.push(ROUTES.auth.signUpSuccess);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="sign-up-form"
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
            <FormError message={errors.password?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            <FormError message={errors.confirmPassword?.message} />
          </div>
          <FormError message={serverError ?? undefined} />
        </form>
      </CardContent>
      <CardFooter className="border-t flex-col gap-3">
        <Button
          type="submit"
          form="sign-up-form"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Creating account..." : "Sign Up"}
        </Button>
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Button variant="link" asChild className="h-auto p-0 font-medium">
            <Link href={ROUTES.auth.login}>Sign In</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
