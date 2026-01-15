"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthForm } from "./auth-form";
import { AUTH_MODE, QUERY_PARAM } from "@/constants/routes";
import { FORM_DATA } from "./constants";

export function AuthFormLayout() {
  const searchParams = useSearchParams();
  const mode = searchParams.get(QUERY_PARAM.MODE) as (typeof AUTH_MODE)[keyof typeof AUTH_MODE] || AUTH_MODE.LOGIN;
  const { title, description, footerText, footerLinkText, footerLinkHref, formData } = FORM_DATA[mode];

  return (
    <div className="grid place-items-center h-screen p-4 bg-zinc-50 dark:bg-black">
      <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">{title}</h1>

          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <AuthForm key={mode} {...formData} />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {footerText}{" "}
          </span>

          <Link
            href={footerLinkHref}
            className="font-medium text-primary hover:underline"
          >
            {footerLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
}
