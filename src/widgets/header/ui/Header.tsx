import Link from "next/link";
import { ROUTES } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href={ROUTES.home} className="text-lg font-bold tracking-wide">
          VOTUM FERRI
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.auth.login}>Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={ROUTES.auth.signUp}>Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
