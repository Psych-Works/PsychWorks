import React from "react";
import Logo from "@/components/logo/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 bg-background">
        {children}
      </main>
    </div>
  );
} 