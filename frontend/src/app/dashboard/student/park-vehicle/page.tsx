"use client";

import React from "react";
import StudentLayout from "@/components/student/StudentLayout";
import StudentParkVehicleView from "@/components/student/StudentParkVehicleView";

export default function StudentParkVehiclePage() {
  return (
    <StudentLayout activeTab="Park Vehicle">
      <StudentParkVehicleView />
    </StudentLayout>
  );
}
