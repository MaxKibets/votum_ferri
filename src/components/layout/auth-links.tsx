"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui";
import { ROUTE } from "@/constants";

export default function AuthLinks() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isLoginPage = pathname === ROUTE.LOGIN;
  const isRegisterPage = pathname === ROUTE.REGISTER;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        disabled={isPending || isLoginPage}
        onClick={() => startTransition(() => router.push(ROUTE.LOGIN))}
      >
        Login
      </Button>

      <Button
        type="button"
        disabled={isPending || isRegisterPage}
        onClick={() => startTransition(() => router.push(ROUTE.REGISTER))}
      >
        Register
      </Button>
    </>
  );
}
