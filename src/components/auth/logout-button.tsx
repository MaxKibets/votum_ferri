"use client";

import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { logoutUser } from "@/actions/auth";
import { Button } from "@/components/ui";

export function LogoutButton() {
  const [{ error }, action, isPending] = useActionState(logoutUser, {
    data: null,
    error: null,
  });

  useEffect(() => {
    if (error?.message) toast.error(error.message);
  }, [error?.message]);

  return (
    <Button
      variant="outline"
      onClick={() => startTransition(() => action())}
      disabled={isPending}
    >
      Logout
    </Button>
  );
}
