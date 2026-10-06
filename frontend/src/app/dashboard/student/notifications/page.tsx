"use client";

import React from "react";
import StudentLayout from "@/components/student/StudentLayout";
import StudentNotificationsView from "@/components/student/StudentNotificationsView";

export default function StudentNotificationsPage() {
  return (
    <StudentLayout activeTab="Notifications">
      <StudentNotificationsView />
    </StudentLayout>
  );
}
