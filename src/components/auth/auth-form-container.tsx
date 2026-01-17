"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { AuthForm } from "./auth-form";
import { LOGIN_FORM_DATA, REGISTER_FORM_DATA } from "./constants";

interface AuthFormContainerProps {
  isLogin?: boolean;
}

export function AuthFormContainer({ isLogin = false }: AuthFormContainerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    title,
    description,
    footerText,
    footerLinkText,
    footerLinkHref,
    formData,
  } = isLogin ? LOGIN_FORM_DATA : REGISTER_FORM_DATA;

  const handleModeChange = () =>
    startTransition(() => router.push(footerLinkHref));

  return (
    <div className="grid place-items-center h-screen p-4 bg-zinc-50 dark:bg-black">
      <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">{title}</h1>

          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <AuthForm disabled={isPending} {...formData} />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">{footerText} </span>

          <button
            type="button"
            onClick={handleModeChange}
            disabled={isPending}
            className="font-medium text-primary hover:underline disabled:opacity-50 disabled:hover:no-underline"
          >
            {footerLinkText}
          </button>
        </div>
      </div>
    </div>
  );
}
