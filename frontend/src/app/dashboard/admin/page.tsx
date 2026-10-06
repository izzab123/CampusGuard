"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminLayout, { AdminTab } from "@/components/admin/AdminLayout";
import AdminDashboardView from "@/components/admin/AdminDashboardView";
import AdminUsersView from "@/components/admin/AdminUsersView";
import AdminAuditLogsView from "@/components/admin/AdminAuditLogsView";
import AdminProfileView from "@/components/admin/AdminProfileView";

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<AdminTab>("Dashboard");

  useEffect(() => {
    const tabParam = searchParams.get("tab")?.toLowerCase();
    if (tabParam === "users" || tabParam === "users-roles") {
      setActiveTab("Users & Roles");
    } else if (tabParam === "audit" || tabParam === "audit-logs" || tabParam === "logs") {
      setActiveTab("Security Audit Logs");
    } else if (tabParam === "profile") {
      setActiveTab("Profile");
    } else if (tabParam === "dashboard") {
      setActiveTab("Dashboard");
    }
  }, [searchParams]);

  return (
    <AdminLayout activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)}>
      {activeTab === "Dashboard" && <AdminDashboardView />}
      {activeTab === "Users & Roles" && <AdminUsersView />}
      {activeTab === "Security Audit Logs" && <AdminAuditLogsView />}
      {activeTab === "Profile" && <AdminProfileView />}
    </AdminLayout>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-500 font-sans text-sm">
          Loading Admin Control Center...
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
