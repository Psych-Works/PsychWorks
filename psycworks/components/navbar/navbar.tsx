import React from "react";
import Logo from "@/components/logo/logo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import UserAvatar from "../auth/user-avatar";

export default function Navbar() {
  return (
    <nav className="bg-primary flex justify-between items-center py-1 px-2 w-full shadow-2xl">
      <Logo width={450} height={60} />

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/assessments" legacyBehavior passHref>
              <NavigationMenuLink className="text-white hover:text-black text-lg px-4 py-2">
                Assessments
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/reports" legacyBehavior passHref>
              <NavigationMenuLink className="text-white hover:text-black text-lg px-4 py-2">
                Reports
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/settings" legacyBehavior passHref>
              <NavigationMenuLink className="text-white hover:text-black text-lg px-4 py-2">
                <UserAvatar />
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
