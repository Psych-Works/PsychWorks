import Logo from "@/components/logo/logo";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Logo width={900} height={60} />
        {children}
      </div>
    </div>
  );
}
