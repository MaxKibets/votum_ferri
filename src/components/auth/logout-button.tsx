"use client";

import { startTransition, useActionState } from "react";
import { logoutUser } from "@/actions/auth";
import { Button } from "@/components/ui";
import { Separator } from "../ui/separator";

export default function LogoutButton() {
  const [, action, isPending] = useActionState(logoutUser, { data: null });

  return (
    <>
      <Separator className="my-3" />
      <Button
        variant="outline"
        onClick={() => startTransition(action)}
        disabled={isPending}
        className="w-full"
      >
        Logout
      </Button>
    </>
  );
}
