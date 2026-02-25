import Link from "next/link";
import { ThemeToggle } from "@/features/theme-toggle";
import { ROUTES } from "@/shared/config/routes";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto flex h-14 items-center justify-center gap-3 px-4">
        <Link
          href={ROUTES.home}
          className="text-sm font-bold tracking-wide text-muted-foreground"
        >
          VOTUM FERRI
        </Link>
        <ThemeToggle />
      </div>
    </footer>
  );
}
