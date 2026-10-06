"use client";

import React from "react";
import ProctorLayout from "@/components/proctor/ProctorLayout";
import ProctorNotificationsView from "@/components/proctor/ProctorNotificationsView";

export default function ProctorNotificationsPage() {
  return (
    <ProctorLayout activeTab="Notifications">
      <ProctorNotificationsView />
    </ProctorLayout>
  );
}
