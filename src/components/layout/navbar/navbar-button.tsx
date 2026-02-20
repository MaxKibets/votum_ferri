"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { POPOVER_ID } from "./constants";

export default function NavbarButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === href;

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="w-full"
      onClick={() => router.push(href)}
      popoverTarget={POPOVER_ID}
      popoverTargetAction="hide"
    >
      {label}
    </Button>
  );
}
