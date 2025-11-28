"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { hasEnvVars } from "@/lib/utils";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    if (!hasEnvVars) {
      router.push("/auth/login");
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
