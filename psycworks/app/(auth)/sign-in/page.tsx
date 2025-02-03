import React, { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthForm defaultTab="signin" />
      </Suspense>
    </div>
  );
}
