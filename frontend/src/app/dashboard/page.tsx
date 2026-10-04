"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredAuthUser, getRoleDashboardPath } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredAuthUser();
    if (!user) {
      router.replace("/login");
    } else {
      router.replace(getRoleDashboardPath(user.role));
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
        <Loader2 className="w-6 h-6 animate-spin text-blue-700" />
        <p>Loading your institutional clearance dashboard...</p>
      </div>
    </div>
  );
}
