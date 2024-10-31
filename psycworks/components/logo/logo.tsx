import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.png";

const Logo = () => {
  return (
    <Link href="/" className="inline-block">
      <Image
        src={logo}
        alt="Fort Worth Psycworks"
        width={250}
        height={49.6}
        priority
        className="object-contain"
      />
    </Link>
  );
};

export default Logo;
