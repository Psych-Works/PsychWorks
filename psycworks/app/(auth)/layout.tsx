import AuthLogo from "@/components/logo/auth-logo";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AuthLogo />
        {children}
      </div>
    </div>
  );
}
