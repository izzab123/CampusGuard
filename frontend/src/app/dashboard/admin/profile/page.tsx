"use client";

import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminProfileView from "@/components/admin/AdminProfileView";

export default function AdminProfilePage() {
  return (
    <AdminLayout activeTab="Profile">
      <AdminProfileView />
    </AdminLayout>
  );
}
