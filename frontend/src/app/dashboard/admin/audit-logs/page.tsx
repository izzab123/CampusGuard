"use client";

import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminAuditLogsView from "@/components/admin/AdminAuditLogsView";

export default function AdminAuditLogsPage() {
  return (
    <AdminLayout activeTab="Security Audit Logs">
      <AdminAuditLogsView />
    </AdminLayout>
  );
}
