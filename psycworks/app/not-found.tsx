"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/assessments");
      } else {
        router.replace("/sign-in");
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return null;
}
