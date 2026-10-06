"use client";

import React from "react";
import StudentLayout from "@/components/student/StudentLayout";
import StudentQrView from "@/components/student/StudentQrView";

export default function StudentMyQrCodePage() {
  return (
    <StudentLayout activeTab="My QR code">
      <StudentQrView />
    </StudentLayout>
  );
}
