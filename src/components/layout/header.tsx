import Link from "next/link";
import { isAuthenticatedUser } from "@/actions/auth";
import { ROUTE } from "@/constants";
import AuthLinks from "./auth-links";
import Navbar from "./navbar";

export default async function Header() {
  const isAuthenticated = await isAuthenticatedUser();

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-2">
        <Link
          href={ROUTE.HOME}
          className="text-xl font-semibold tracking-tight font-cinzel"
        >
          VOTUM FERRI
        </Link>

        <div className="flex items-center gap-2">
          {/* TODO: show placeholder while auth is loading */}
          {isAuthenticated ? <Navbar /> : <AuthLinks />}
        </div>
      </div>
    </header>
  );
}
