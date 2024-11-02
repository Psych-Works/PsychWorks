import React from "react";
import Logo from "@/components/logo/logo";

export default function Navbar() {
  return (
    <nav className="bg-primary flex justify-between items-center py-1 px-2 w-full shadow-2xl">
      {/* Logo */}
      <Logo width={450} height={60} />

      {/* Navigation Links */}
      <ul className="flex space-x-8 mr-10">
        <li>
          <a
            href="/assessments"
            className="text-white hover:text-black text-lg"
          >
            Assessments
          </a>
        </li>
        <li>
          <a href="/templates" className="text-white hover:text-black text-lg">
            Templates
          </a>
        </li>
        <li>
          <a href="/settings" className="text-white hover:text-black text-lg">
            Settings
          </a>
        </li>
      </ul>
    </nav>
  );
}
