import React from "react";
import Logo from "@/components/logo/logo";
import Navbar from "@/components/navbar/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 bg-background">
        <Navbar />
        {children}
      </main>
    </div>
  );
} 