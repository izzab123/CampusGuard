"use client";

import React from "react";
import StudentLayout from "@/components/student/StudentLayout";
import StudentReportView from "@/components/student/StudentReportView";

export default function StudentReportPage() {
  return (
    <StudentLayout activeTab="Report incident">
      <StudentReportView />
    </StudentLayout>
  );
}
