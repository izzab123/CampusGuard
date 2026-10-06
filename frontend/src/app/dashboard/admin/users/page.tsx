"use client";

import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminUsersView from "@/components/admin/AdminUsersView";

export default function AdminUsersPage() {
  return (
    <AdminLayout activeTab="Users & Roles">
      <AdminUsersView />
    </AdminLayout>
  );
}
