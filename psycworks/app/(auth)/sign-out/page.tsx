"use client";

import React, { useEffect } from "react";
import { Loader } from "lucide-react";
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

  return (
    <>
      <div className="justify-center items-center">
        <div className="flex space-x-5 justify-center items-center">
          <Loader className="animate-spin w-10 h-10 text-white" />
          <p className="text-white text-xl">Sign Out In Progress...</p>
        </div>
      </div>
    </>
  );
};

export default SignOutPage;
