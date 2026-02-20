import { Menu } from "lucide-react";
import { LogoutButton } from "@/components/auth";
import { Button } from "@/components/ui";
import { ROUTE } from "@/constants";
import { POPOVER_ID } from "./constants";
import NavbarButton from "./navbar-button";

const NAV_ITEMS = [
  { href: ROUTE.DASHBOARD, label: "Dashboard" },
  { href: ROUTE.PROFILE, label: "Profile" },
] as const;

export default function Navbar() {
  return (
    <nav className="flex items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        aria-controls={POPOVER_ID}
        popoverTarget={POPOVER_ID}
        className="[anchor-name:--main-navigation-anchor]"
      >
        <Menu />
      </Button>

      <ul
        id={POPOVER_ID}
        popover="auto"
        className="shadow-sm space-y-3 absolute [position-anchor:--main-navigation-anchor] top-[anchor(--main-navigation-anchor_bottom)] left-[anchor(--main-navigation-anchor_right)] [position-area:left]"
      >
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <NavbarButton href={item.href} label={item.label} />
          </li>
        ))}
        <li>
          <LogoutButton />
        </li>
      </ul>
    </nav>
  );
}
