import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.png";

const AuthLogo = () => {
  return (
    <Link href="/" className="inline-block">
      <Image
        src={logo}
        alt="Fort Worth Psycworks"
        width={900}
        height={60}
        priority
        className="object-contain"
      />
    </Link>
  );
};

export default AuthLogo; 