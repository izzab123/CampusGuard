"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  User,
  Building2,
  CheckCircle2,
  RotateCcw,
  Bell,
  LogOut,
  Layers,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  X,
  ExternalLink,
  Plus,
  Loader2,
  History,
  Activity,
  AlertCircle,
  Eye,
  Check,
  ClipboardList,
  FileText,
  FileSpreadsheet,
  Download,
  Filter,
  ArrowRight,
  Shield,
  Radio,
  ScanLine,
  Search,
  BadgeAlert
} from "lucide-react";
import { getStoredAuthUser, performLogout, AuthUser, getRoleDashboardPath } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

type ReportType = "incidents" | "attendance" | "scan-logs";

interface ReportPreviewSummary {
  reportType: string;
  title: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  generatedBy: string;
  generatedByBadge: string;
  generatedByRole: string;
  targetAudience: string;
  classification: string;
  totalRecords: number;
  metrics: Record<string, number>;
  records: any[];
}

export default function SupervisorReportExportPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Form State
  const [reportType, setReportType] = useState<ReportType>("incidents");
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Data & State
  const [summaryData, setSummaryData] = useState<ReportPreviewSummary | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingCsv, setIsDownloadingCsv] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Check Auth & Shift Supervisor Role
  useEffect(() => {
    const user = getStoredAuthUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    const roleUpper = (user.role || "").toUpperCase().replace("ROLE_", "").replace("_", " ");
    const isSupervisorOrAdmin =
      roleUpper === "SHIFT SUPERVISOR" ||
      roleUpper === "SUPERVISOR" ||
      roleUpper === "ADMIN" ||
      roleUpper === "ADMINISTRATOR";

    if (!isSupervisorOrAdmin) {
      router.replace(getRoleDashboardPath(user.role));
      return;
    }

    setCurrentUser(user);
    setAuthChecked(true);
  }, [router]);

  // Headers helper
  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = {};
    if (currentUser) {
      headers["X-User-Role"] = currentUser.role || "Shift Supervisor";
      headers["X-User-Name"] = currentUser.name || "Supervisor Elena Rostova";
      headers["X-User-Email"] = currentUser.email || "supervisor@campusguard.edu";
      headers["X-User-Badge"] = (currentUser as any).badgeNumber || "SS-104";
      headers["X-User-Id"] = String(currentUser.id || "104");
    }
    return headers;
  }, [currentUser]);

  // 2. Fetch Live Preview Data
  const fetchPreview = useCallback(async () => {
    if (!authChecked) return;
    setIsLoadingPreview(true);
    setErrorMessage(null);
    try {
      const url = API_ENDPOINTS.supervisorReports.summary({
        reportType,
        startDate,
        endDate,
      });

      const res = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: You must be logged in as a Shift Supervisor or Administrator to generate exports.");
        }
        throw new Error(`Failed to load preview data (HTTP ${res.status})`);
      }

      const data: ReportPreviewSummary = await res.json();
      setSummaryData(data);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to fetch report preview.");
    } finally {
      setIsLoadingPreview(false);
    }
  }, [authChecked, reportType, startDate, endDate, getAuthHeaders]);

  useEffect(() => {
    if (authChecked) {
      fetchPreview();
    }
  }, [authChecked, fetchPreview]);

  // Quick Preset Handlers
  const applyPreset = (preset: "today" | "last7" | "last14" | "thisMonth" | "last30") => {
    const now = new Date();
    const endStr = now.toISOString().split("T")[0];
    let startD = new Date();

    switch (preset) {
      case "today":
        break;
      case "last7":
        startD.setDate(now.getDate() - 7);
        break;
      case "last14":
        startD.setDate(now.getDate() - 14);
        break;
      case "thisMonth":
        startD = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "last30":
        startD.setDate(now.getDate() - 30);
        break;
    }
    const startStr = startD.toISOString().split("T")[0];
    setStartDate(startStr);
    setEndDate(endStr);
  };

  // Download Handler (PDF or CSV)
  const handleDownload = async (format: "pdf" | "csv") => {
    setErrorMessage(null);
    setDownloadSuccessMessage(null);

    if (format === "pdf") {
      setIsDownloadingPdf(true);
    } else {
      setIsDownloadingCsv(true);
    }

    try {
      const url =
        format === "pdf"
          ? API_ENDPOINTS.supervisorReports.exportPdf({ reportType, startDate, endDate })
          : API_ENDPOINTS.supervisorReports.exportCsv({ reportType, startDate, endDate });

      const res = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access denied: Shift Supervisor credentials required for administration exports.");
        }
        throw new Error(`Download failed with status HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = `CampusGuard_${reportType}_${startDate}_to_${endDate}.${format}`;
      if (contentDisposition && contentDisposition.includes("filename=")) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      // Trigger browser download
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setDownloadSuccessMessage(
        `Successfully generated and downloaded ${format.toUpperCase()}: ${filename}`
      );
    } catch (err: any) {
      setErrorMessage(err.message || `Failed to download ${format.toUpperCase()} report.`);
    } finally {
      if (format === "pdf") {
        setIsDownloadingPdf(false);
      } else {
        setIsDownloadingCsv(false);
      }
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-blue-700 animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-500">
          Verifying Shift Supervisor credentials...
        </p>
      </div>
    );
  }

  const displayName = currentUser?.name || "Supervisor Elena Rostova";
  const displayBadge = (currentUser as any)?.badgeNumber || "SS-104";

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col text-slate-900 font-sans">
      {/* 1. TOP HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-[1520px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard/supervisor" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a44c2] to-[#0d2a8a] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="font-black text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                  CampusGuard
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    Ops
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 block font-medium">
                  Supervisor Operations Portal
                </span>
              </div>
            </Link>

            {/* Navigation Bar */}
            <nav className="hidden md:flex items-center gap-5 pl-4 text-xs font-semibold text-slate-600">
              <Link
                href="/dashboard/supervisor"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/supervisor/reports"
                className="py-5 relative transition cursor-pointer text-blue-700 font-bold border-b-2 border-blue-700"
              >
                Reports Export
              </Link>
              <Link
                href="/dashboard/supervisor/occurrence-register"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Occurrence Register
              </Link>
              <Link
                href="/dashboard/supervisor/incidents"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Incident Tracking
              </Link>
              <Link
                href="/dashboard/supervisor/shifts"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Shifts
              </Link>
              <Link
                href="/dashboard/supervisor/attendance"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Attendance
              </Link>
              <Link
                href="/dashboard/supervisor/escalations"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Escalations
              </Link>
              <Link
                href="/dashboard/supervisor/logbook"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Logbook
              </Link>
              <Link
                href="/dashboard/supervisor/notifications"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Notifications
              </Link>
            </nav>
          </div>

          {/* Right Status & Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Official Export Console • Shift Supervisor</span>
            </div>

            <Link href="/dashboard/supervisor/notifications" className="relative cursor-pointer" title="Notifications">
              <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                <Bell className="w-4 h-4" />
              </div>
            </Link>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#1a44c2] text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                <Image
                  src="/supervisor-elena.jpg"
                  alt={displayName}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  Badge #{displayBadge}
                </span>
              </div>
              <button
                type="button"
                onClick={() => performLogout()}
                title="Log out"
                className="ml-1 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN */}
      <div className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* LEFT SIDEBAR: SUPERVISOR CONSOLE */}
        <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Supervisor Console
            </div>
            <nav className="space-y-1">
              {[
                { name: "Dashboard", href: "/dashboard/supervisor", icon: ShieldCheck, active: false },
                { name: "Reports Export", href: "/dashboard/supervisor/reports", icon: Download, active: true },
                { name: "Occurrence Register", href: "/dashboard/supervisor/occurrence-register", icon: ClipboardList, active: false },
                { name: "Incident Tracking", href: "/dashboard/supervisor/incidents", icon: AlertTriangle, active: false },
                { name: "Shifts", href: "/dashboard/supervisor/shifts", icon: Calendar, active: false },
                { name: "Attendance", href: "/dashboard/supervisor/attendance", icon: UserCheck, active: false },
                { name: "Escalations", href: "/dashboard/supervisor/escalations", icon: ShieldAlert, active: false },
                { name: "Logbook", href: "/dashboard/supervisor/logbook", icon: Layers, active: false },
                { name: "Notifications", href: "/dashboard/supervisor/notifications", icon: Bell, active: false },
                { name: "Profile", href: "/dashboard/supervisor/profile", icon: UserCheck, active: false },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                    item.active
                      ? "bg-[#1a44c2] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* MAIN REPORT GENERATION INTERFACE */}
        <main className="flex-1 space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1a44c2]">
                <FileText className="w-4 h-4 text-[#1a44c2]" />
                <span>Executive Governance &amp; Administration Exports</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Administration Summary Report Export
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Generate and export official operational summaries to share directly with University Administration and senior leadership.
                Outputs include certified metadata headers, precise date ranges, and generation credentials in both PDF and CSV formats.
              </p>
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => handleDownload("pdf")}
                disabled={isDownloadingPdf || isLoadingPreview}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1a44c2] hover:bg-[#15369b] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition disabled:opacity-50 cursor-pointer"
                title="Download formatted executive PDF"
              >
                {isDownloadingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <FileText className="w-4 h-4 text-amber-300" />
                )}
                <span>{isDownloadingPdf ? "Compiling PDF..." : "Download PDF"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownload("csv")}
                disabled={isDownloadingCsv || isLoadingPreview}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition disabled:opacity-50 cursor-pointer"
                title="Download spreadsheet CSV"
              >
                {isDownloadingCsv ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                )}
                <span>{isDownloadingCsv ? "Generating CSV..." : "Download CSV"}</span>
              </button>
            </div>
          </div>

          {/* Feedback alerts */}
          {downloadSuccessMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{downloadSuccessMessage}</span>
              </div>
              <button
                onClick={() => setDownloadSuccessMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-700 hover:text-rose-900 font-bold ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* CONFIGURATION PANEL: REPORT TYPE & DATE RANGE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Report Type Selector (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1a44c2]"></span>
                  Select Report Type
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Step 1 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Incidents */}
                <button
                  type="button"
                  onClick={() => setReportType("incidents")}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    reportType === "incidents"
                      ? "border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="font-extrabold text-xs text-slate-900">Incidents Summary</div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Campus security incidents, severity triage, dispatched units, and outcomes.
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] font-bold">
                    <span className="text-blue-700">Security Dispatch</span>
                    {reportType === "incidents" && <Check className="w-3.5 h-3.5 text-blue-700" />}
                  </div>
                </button>

                {/* 2. Attendance & No-Shows */}
                <button
                  type="button"
                  onClick={() => setReportType("attendance")}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    reportType === "attendance"
                      ? "border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="font-extrabold text-xs text-slate-900">Attendance / No-Shows</div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Guard post check-ins, biometric timestamps, unexcused no-shows, and coverage.
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] font-bold">
                    <span className="text-amber-700">Guard Operations</span>
                    {reportType === "attendance" && <Check className="w-3.5 h-3.5 text-blue-700" />}
                  </div>
                </button>

                {/* 3. Gate & Access Scan Logs */}
                <button
                  type="button"
                  onClick={() => setReportType("scan-logs")}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    reportType === "scan-logs"
                      ? "border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <ScanLine className="w-4 h-4" />
                    </div>
                    <div className="font-extrabold text-xs text-slate-900">Gate Scan Logs</div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      RFID barrier telemetry, optical turnstile passes, plate checks, and access clearances.
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] font-bold">
                    <span className="text-emerald-700">Perimeter Access</span>
                    {reportType === "scan-logs" && <Check className="w-3.5 h-3.5 text-blue-700" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Date Range Selector (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-700" />
                  Select Date Range
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Step 2 of 2</span>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Today", value: "today" as const },
                  { label: "Last 7 Days", value: "last7" as const },
                  { label: "Last 14 Days", value: "last14" as const },
                  { label: "This Month", value: "thisMonth" as const },
                  { label: "Last 30 Days", value: "last30" as const },
                ].map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => applyPreset(preset.value)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    START DATE
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    END DATE
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  Querying records from <strong className="text-slate-800">{startDate}</strong> to <strong className="text-slate-800">{endDate}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* METADATA EMBEDDING PREVIEW CARD */}
          <div className="bg-gradient-to-r from-slate-900 to-[#12285e] text-white rounded-2xl p-6 shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Shield className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-blue-200">
                    Export Header &amp; Metadata Specification
                  </div>
                  <div className="text-base font-extrabold text-white">
                    {summaryData?.title || "Operational Summary Report"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Role-Based Scoping Enforced
                </span>
              </div>
            </div>

            {/* Embedded Header Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Target Audience
                </span>
                <span className="font-semibold text-slate-100">
                  {summaryData?.targetAudience || "University Administration"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Selected Range
                </span>
                <span className="font-bold text-amber-300">
                  {startDate} to {endDate}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Generation Timestamp
                </span>
                <span className="font-mono text-slate-200 text-[11px]">
                  {summaryData?.generatedAt || "Live on export"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Generated By (Supervisor)
                </span>
                <span className="font-bold text-white">
                  {displayName} (ID #{displayBadge})
                </span>
              </div>
            </div>
          </div>

          {/* KPI METRICS OVERVIEW */}
          {summaryData?.metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {reportType === "incidents" && (
                <>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Total Incidents</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{summaryData.metrics.totalIncidents ?? 0}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-rose-600 uppercase">Critical Severity</span>
                    <div className="text-2xl font-black text-rose-600 mt-1">{summaryData.metrics.criticalCount ?? 0}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-amber-600 uppercase">High Severity</span>
                    <div className="text-2xl font-black text-amber-600 mt-1">{summaryData.metrics.highCount ?? 0}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-blue-600 uppercase">Active / In Progress</span>
                    <div className="text-2xl font-black text-blue-600 mt-1">{summaryData.metrics.openCount ?? 0}</div>
                  </div>
                </>
              )}

              {reportType === "attendance" && (
                <>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Total Duty Shifts</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{summaryData.metrics.totalShifts ?? 0}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase">Present / Checked-In</span>
                    <div className="text-2xl font-black text-emerald-600 mt-1">{summaryData.metrics.presentCount ?? 0}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-rose-600 uppercase">Flagged No-Shows</span>
                    <div className="text-2xl font-black text-rose-600 mt-1">{summaryData.metrics.noShowCount ?? 0}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-blue-600 uppercase">Scheduled Shifts</span>
                    <div className="text-2xl font-black text-blue-600 mt-1">{summaryData.metrics.scheduledCount ?? 0}</div>
                  </div>
                </>
              )}

              {reportType === "scan-logs" && (
                <>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Total Scan Telemetry</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{summaryData.metrics.totalScans ?? 0}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase">Access Granted</span>
                    <div className="text-2xl font-black text-emerald-600 mt-1">{summaryData.metrics.grantedCount ?? 0}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-rose-600 uppercase">Access Denied</span>
                    <div className="text-2xl font-black text-rose-600 mt-1">{summaryData.metrics.deniedCount ?? 0}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[11px] font-bold text-amber-600 uppercase">Flagged / Override</span>
                    <div className="text-2xl font-black text-amber-600 mt-1">{summaryData.metrics.flaggedCount ?? 0}</div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* LIVE RECORD PREVIEW TABLE */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Live Export Preview
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-extrabold text-[11px]">
                  {summaryData?.records?.length ?? 0} records
                </span>
              </div>

              <button
                type="button"
                onClick={fetchPreview}
                disabled={isLoadingPreview}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isLoadingPreview ? "animate-spin" : ""}`} />
                <span>Refresh Data</span>
              </button>
            </div>

            {isLoadingPreview ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-blue-700 mb-2" />
                <span className="text-xs font-semibold">Loading data preview from sentinel database...</span>
              </div>
            ) : summaryData?.records?.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <ClipboardList className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                <p className="text-xs font-bold text-slate-600">No records found within the selected date range</p>
                <p className="text-[11px] text-slate-400">Try broadening the date window or selecting another report type.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* 1. INCIDENTS TABLE */}
                {reportType === "incidents" && (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        <th className="py-3 px-4">INCIDENT</th>
                        <th className="py-3 px-4">DATE / TIME</th>
                        <th className="py-3 px-4">SEVERITY</th>
                        <th className="py-3 px-4">STATUS</th>
                        <th className="py-3 px-4">LOCATION</th>
                        <th className="py-3 px-4">REPORTER</th>
                        <th className="py-3 px-4">OFFICE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {summaryData?.records?.map((rec: any) => (
                        <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            #{rec.id} - {rec.title}
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                            {rec.createdAt ? rec.createdAt.replace("T", " ").substring(0, 16) : ""}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                rec.severity === "CRITICAL"
                                  ? "bg-rose-100 text-rose-800"
                                  : rec.severity === "HIGH"
                                  ? "bg-amber-100 text-amber-800"
                                  : rec.severity === "MEDIUM"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-slate-100 text-slate-800"
                              }`}
                            >
                              {rec.severity}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                rec.status === "RESOLVED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {rec.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{rec.location}</td>
                          <td className="py-3 px-4 text-slate-600">
                            {rec.reporterName} ({rec.reporterRole})
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px] font-semibold">
                            {rec.routedTo || "GENERAL"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* 2. ATTENDANCE & NO-SHOWS TABLE */}
                {reportType === "attendance" && (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        <th className="py-3 px-4">DATE</th>
                        <th className="py-3 px-4">GUARD</th>
                        <th className="py-3 px-4">POST LOCATION</th>
                        <th className="py-3 px-4">SHIFT</th>
                        <th className="py-3 px-4">ATTENDANCE STATUS</th>
                        <th className="py-3 px-4">CHECK-IN / NO-SHOW</th>
                        <th className="py-3 px-4">RELIEVER</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {summaryData?.records?.map((rec: any) => (
                        <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-bold text-slate-900">{rec.dutyDate}</td>
                          <td className="py-3 px-4 text-slate-800 font-semibold">
                            {rec.guardName} <span className="text-slate-400 text-[11px]">({rec.guardBadgeNumber})</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{rec.postLocation}</td>
                          <td className="py-3 px-4 text-slate-600">{rec.shiftType || "DUTY"}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                rec.attendanceStatus === "PRESENT" || rec.checkedIn
                                  ? "bg-emerald-100 text-emerald-800"
                                  : rec.attendanceStatus === "NO_SHOW" || rec.countsAsNoShow
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {rec.attendanceStatus || (rec.checkedIn ? "PRESENT" : "SCHEDULED")}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 text-[11px]">
                            {rec.checkedIn && rec.checkInTime
                              ? `Checked In: ${rec.checkInTime.replace("T", " ").substring(0, 16)}`
                              : rec.countsAsNoShow
                              ? `Flagged No-Show (${rec.noShowReason || "Overdue"})`
                              : "Pending Start"}
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {rec.relieverName ? `${rec.relieverName} (${rec.relieverBadgeNumber})` : "Standard Post"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* 3. SCAN LOGS TABLE */}
                {reportType === "scan-logs" && (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        <th className="py-3 px-4">TIMESTAMP</th>
                        <th className="py-3 px-4">SCANNER TYPE</th>
                        <th className="py-3 px-4">GATE LOCATION</th>
                        <th className="py-3 px-4">SUBJECT IDENTIFIER</th>
                        <th className="py-3 px-4">SUBJECT NAME</th>
                        <th className="py-3 px-4">ACCESS STATUS</th>
                        <th className="py-3 px-4">OPERATOR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {summaryData?.records?.map((rec: any) => (
                        <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                            {rec.scanTimestamp ? rec.scanTimestamp.replace("T", " ").substring(0, 16) : ""}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {rec.scannerType?.replace(/_/g, " ")}
                          </td>
                          <td className="py-3 px-4 text-slate-600">{rec.gateLocation}</td>
                          <td className="py-3 px-4 font-bold text-blue-900">{rec.subjectIdentifier}</td>
                          <td className="py-3 px-4 text-slate-700">{rec.subjectName || "Visitor"}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                rec.accessStatus === "GRANTED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : rec.accessStatus === "DENIED"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {rec.accessStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {rec.operatorGuard || "Automated"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
