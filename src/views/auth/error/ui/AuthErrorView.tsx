"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ROUTES } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const ERROR_MESSAGES: Record<string, string> = {
  email_confirmation_failed:
    "We could not confirm your email. The link may have expired.",
  default: "An unexpected error occurred. Please try again.",
};

export function AuthErrorView() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error_code") ?? "default";
  const message = ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.default;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Something went wrong</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
      <CardFooter className="border-t">
        <Button asChild className="w-full">
          <Link href={ROUTES.auth.login}>Back to login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
