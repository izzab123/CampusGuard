"use client";

import React, { useState, useEffect } from "react";
import StudentLayout, { StudentTab } from "@/components/student/StudentLayout";
import StudentDashboardView from "@/components/student/StudentDashboardView";
import StudentQrView from "@/components/student/StudentQrView";
import StudentReportView from "@/components/student/StudentReportView";
import StudentNotificationsView from "@/components/student/StudentNotificationsView";
import StudentProfileView from "@/components/student/StudentProfileView";

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState<StudentTab>("Dashboard");

  // Sync tab with URL query parameter on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab")?.toLowerCase();
      if (tabParam === "qr" || tabParam === "my-qr-code" || tabParam === "qrcode") {
        setActiveTab("My QR code");
      } else if (tabParam === "report" || tabParam === "report-incident" || tabParam === "incidents") {
        setActiveTab("Report incident");
      } else if (tabParam === "notifications") {
        setActiveTab("Notifications");
      } else if (tabParam === "profile") {
        setActiveTab("Profile");
      } else if (tabParam === "dashboard") {
        setActiveTab("Dashboard");
      }
    }
  }, []);

  return (
    <StudentLayout activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)}>
      {activeTab === "Dashboard" && <StudentDashboardView />}
      {activeTab === "My QR code" && <StudentQrView />}
      {activeTab === "Report incident" && <StudentReportView />}
      {activeTab === "Notifications" && <StudentNotificationsView />}
      {activeTab === "Profile" && <StudentProfileView />}
    </StudentLayout>
  );
}
