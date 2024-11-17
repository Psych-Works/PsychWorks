"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SignOutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const signOut = async () => {
      try {
        const res = await fetch("/api/auth/sign-out", {
          method: "POST",
        });

        if (!res.ok) {
          const { error } = await res.json();
          console.error("Sign out failed:", error);
          return;
        }

        console.log("Successfully signed out");
        // Redirect to sign-in page after sign out
        router.push("/sign-in");
      } catch (error) {
        console.error("An error occurred during sign out:", error);
      }
    };

    signOut();
  }, [router]);

  return null; // This component only handles logic
};

export default SignOutPage;