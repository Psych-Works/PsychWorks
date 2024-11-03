import React from "react";
import Logo from "@/components/logo/logo";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-primary flex justify-between items-center py-1 px-2 w-full shadow-2xl">
      {/* Logo */}
      <Logo width={450} height={60} />

      {/* Navigation Links */}
      <ul className="flex space-x-8 mr-10">
        <li>
          <Link
            href="/assessments"
            className="text-white hover:text-black text-lg"
          >
            Assessments
          </Link>
        </li>
        <li>
          <Link href="/templates" className="text-white hover:text-black text-lg">
            Templates
          </Link>
        </li>
        <li>
          <Link href="/settings" className="text-white hover:text-black text-lg">
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}
