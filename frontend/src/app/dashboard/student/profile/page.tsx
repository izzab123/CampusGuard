"use client";

import React from "react";
import StudentLayout from "@/components/student/StudentLayout";
import StudentProfileView from "@/components/student/StudentProfileView";

export default function StudentProfilePage() {
  return (
    <StudentLayout activeTab="Profile">
      <StudentProfileView />
    </StudentLayout>
  );
}
