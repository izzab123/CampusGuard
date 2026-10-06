"use client";

import React from "react";
import ProctorLayout from "@/components/proctor/ProctorLayout";
import ProctorProfileView from "@/components/proctor/ProctorProfileView";

export default function ProctorProfilePage() {
  return (
    <ProctorLayout activeTab="Profile">
      <ProctorProfileView />
    </ProctorLayout>
  );
}
