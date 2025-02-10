import React, { Suspense } from "react";
import ForgotPasswordPage from "@/components/auth/forgot-password";

export default function ForgotPassword() {
  return (
    <div className="flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <ForgotPasswordPage />
      </Suspense>
    </div>
  );
}