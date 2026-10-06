"use client";

import React from "react";
import ProctorLayout from "@/components/proctor/ProctorLayout";
import ProctorIncidentsView from "@/components/proctor/ProctorIncidentsView";

export default function ProctorIncidentsPage() {
  return (
    <ProctorLayout activeTab="Incidents">
      <ProctorIncidentsView />
    </ProctorLayout>
  );
}
