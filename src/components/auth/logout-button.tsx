"use client";

import { startTransition, useActionState } from "react";
import { logoutUser } from "@/actions/auth";
import { Button } from "@/components/ui";

export function LogoutButton() {
  const [, action, isPending] = useActionState(logoutUser, {
    data: null,
    error: null,
  })

  return (
    <Button
      variant="outline"
      onClick={() => startTransition(action)}
      disabled={isPending}
    >
      Logout
    </Button>
  );
}
