"use client";

import React, { useState, useEffect } from "react";
import ProctorLayout, { ProctorTab } from "@/components/proctor/ProctorLayout";
import ProctorDashboardView from "@/components/proctor/ProctorDashboardView";
import ProctorIncidentsView from "@/components/proctor/ProctorIncidentsView";
import ProctorNotificationsView from "@/components/proctor/ProctorNotificationsView";
import ProctorProfileView from "@/components/proctor/ProctorProfileView";

export default function ProctorAndDswDashboard() {
  const [activeTab, setActiveTab] = useState<ProctorTab>("Dashboard");

  // Read URL query parameter if present on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab")?.toLowerCase();
      if (tabParam === "incidents") setActiveTab("Incidents");
      else if (tabParam === "notifications") setActiveTab("Notifications");
      else if (tabParam === "profile") setActiveTab("Profile");
      else if (tabParam === "dashboard") setActiveTab("Dashboard");
    }
  }, []);

  return (
    <ProctorLayout activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)}>
      {activeTab === "Dashboard" && <ProctorDashboardView />}
      {activeTab === "Incidents" && <ProctorIncidentsView />}
      {activeTab === "Notifications" && <ProctorNotificationsView />}
      {activeTab === "Profile" && <ProctorProfileView />}
    </ProctorLayout>
  );
}
