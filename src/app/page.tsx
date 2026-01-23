import Link from "next/link";
import { Button, ButtonGroup, ButtonGroupSeparator } from "@/components/ui";
import { ROUTE } from "@/constants/routes";

export default function Home() {
  return (
    <div className="grid place-items-center h-screen p-4 bg-zinc-50 font-sans dark:bg-black">
      <ButtonGroup className="gap-2">
        <Button asChild>
          <Link href={ROUTE.LOGIN}>Login</Link>
        </Button>

        <ButtonGroupSeparator />

        <Button asChild>
          <Link href={ROUTE.REGISTER}>Register</Link>
        </Button>
      </ButtonGroup>
    </div>
  );
}
