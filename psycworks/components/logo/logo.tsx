import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.png";

const Logo = ({ width, height }: { width: number; height: number }) => {
  return (
    <Link href="/" className="inline-block">
      <Image
        src={logo}
        alt="Fort Worth Psycworks"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </Link>
  );
};

export default Logo;
