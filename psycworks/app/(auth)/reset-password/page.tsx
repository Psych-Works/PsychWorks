import React, { Suspense } from "react";
import ResetPasswordPage from "@/components/auth/reset-password";

export default function ResetPassword() {
  return (
    <div className="flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordPage />
      </Suspense>
    </div>
  );
}