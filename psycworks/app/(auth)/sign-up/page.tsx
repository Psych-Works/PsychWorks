import { AuthForm } from "@/components/auth/auth-form";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center">
      <AuthForm defaultTab="signup" />
    </div>
  );
}
