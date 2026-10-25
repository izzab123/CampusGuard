"use client";

import React from "react";
import StudentLayout from "@/components/student/StudentLayout";
import StudentRegisterVehicleView from "@/components/student/StudentRegisterVehicleView";

export default function StudentRegisterVehiclePage() {
  return (
    <StudentLayout activeTab="Register vehicle">
      <StudentRegisterVehicleView />
    </StudentLayout>
  );
}
