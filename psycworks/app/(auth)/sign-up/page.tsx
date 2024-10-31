import { AuthForm } from "@/components/auth/auth-form"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthForm defaultTab="signup" />
    </div>
  )
} 