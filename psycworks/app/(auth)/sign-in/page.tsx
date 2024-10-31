import { AuthForm } from "@/components/auth/auth-form";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center">
      <AuthForm defaultTab="signin" />
    </div>
  );
}
