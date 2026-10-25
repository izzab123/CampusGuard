"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  AlertTriangle,
  Search,
  Filter,
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
  ClipboardList
} from "lucide-react";
import { getStoredAuthUser, performLogout, AuthUser, getRoleDashboardPath } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

export interface IncidentRecord {
  id: number;
  title: string;
  description: string;
  severity: string;
  location: string;
  status: string;
  routedTo?: string;
  reporterName?: string;
  reporterRole?: string;
  reporterEmail?: string;
  createdAt: string | number;
  resolvedAt?: string | number | null;
}

export default function SupervisorIncidentTrackingPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // View Mode: Active Tracking vs Incident History
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Inspect Modal
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<number | null>(null);

  // New Incident Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newSeverity, setNewSeverity] = useState("HIGH");
  const [newOffice, setNewOffice] = useState("CENTRAL_DISPATCH");
  const [newDescription, setNewDescription] = useState("");
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // Check auth and role
  useEffect(() => {
    const authUser = getStoredAuthUser();
    if (!authUser) {
      router.replace("/login");
      return;
    }
    setUser(authUser);
    setIsAuthLoading(false);

    if (authUser.role === "Shift Supervisor") {
      fetchIncidents();
    }
  }, [router]);

  const fetchIncidents = async () => {
    setIsLoadingIncidents(true);
    try {
      const res = await fetch(API_ENDPOINTS.incidents.list);
      if (res.ok) {
        const data = await res.json();
        setIncidents(Array.isArray(data) ? data : []);
      } else {
        showAlert("Failed to retrieve incidents from dispatch service.", "error");
      }
    } catch {
      showAlert("Network error connecting to incident dispatch API.", "error");
    } finally {
      setIsLoadingIncidents(false);
    }
  };

  const showAlert = (message: string, type: "success" | "error" | "info" = "info") => {
    setActionNotice({ message, type });
    setTimeout(() => {
      setActionNotice(null);
    }, 4500);
  };

  // Helper: Normalize status
  const isStatusResolved = (status?: string): boolean => {
    if (!status) return false;
    return status.trim().toUpperCase() === "RESOLVED";
  };

  const isStatusOpenOrInProgress = (status?: string): boolean => {
    if (!status) return true;
    const s = status.trim().toUpperCase().replace(" ", "_");
    return s === "OPEN" || s === "IN_PROGRESS" || s === "INPROGRESS" || s === "DISPATCHED" || s === "IN_TRIAGE";
  };

  const formatStatusDisplay = (status?: string): { label: string; badgeClass: string } => {
    if (!status) return { label: "Open", badgeClass: "bg-amber-100 text-amber-800 border-amber-200" };
    const s = status.trim().toUpperCase().replace(" ", "_");
    switch (s) {
      case "RESOLVED":
        return { label: "Resolved", badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      case "IN_PROGRESS":
      case "INPROGRESS":
        return { label: "In Progress", badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-200" };
      case "DISPATCHED":
        return { label: "Dispatched", badgeClass: "bg-sky-100 text-sky-800 border-sky-200" };
      case "IN_TRIAGE":
        return { label: "In Triage", badgeClass: "bg-purple-100 text-purple-800 border-purple-200" };
      case "OPEN":
      default:
        return { label: "Open", badgeClass: "bg-amber-100 text-amber-800 border-amber-200" };
    }
  };

  // Helper: Format Severity
  const formatSeverityDisplay = (severity?: string): { label: string; badgeClass: string; dotClass: string } => {
    const s = (severity || "MEDIUM").toUpperCase();
    if (s === "CRITICAL") {
      return { label: "CRITICAL", badgeClass: "bg-red-100 text-red-800 border-red-300", dotClass: "bg-red-600 animate-pulse" };
    }
    if (s === "HIGH" || s === "MAJOR") {
      return { label: "HIGH", badgeClass: "bg-orange-100 text-orange-800 border-orange-200", dotClass: "bg-orange-600" };
    }
    if (s === "MEDIUM" || s === "MODERATE") {
      return { label: "MEDIUM", badgeClass: "bg-amber-100 text-amber-800 border-amber-200", dotClass: "bg-amber-600" };
    }
    return { label: "LOW", badgeClass: "bg-slate-100 text-slate-700 border-slate-200", dotClass: "bg-slate-500" };
  };

  // Helper: Format office handling it
  const formatHandlingOffice = (routedTo?: string): { name: string; tagClass: string } => {
    if (!routedTo) {
      return { name: "Central Dispatch & NOC", tagClass: "bg-blue-50 text-blue-700 border-blue-200" };
    }
    const r = routedTo.trim().toUpperCase().replace(" ", "_");
    if (r === "PROCTOR_AND_DSW" || r === "PROCTOR" || r === "DSW") {
      return { name: "Proctor & DSW Executive Desk", tagClass: "bg-purple-50 text-purple-700 border-purple-200" };
    }
    if (r === "SHIFT_SUPERVISOR_COMMAND" || r === "SUPERVISOR") {
      return { name: "Shift Supervisor Command", tagClass: "bg-indigo-50 text-indigo-700 border-indigo-200" };
    }
    if (r === "FACILITIES_AND_SAFETY" || r === "FACILITIES") {
      return { name: "Facilities & Campus Safety", tagClass: "bg-teal-50 text-teal-700 border-teal-200" };
    }
    if (r === "CENTRAL_DISPATCH" || r === "DISPATCH") {
      return { name: "Central Dispatch & NOC", tagClass: "bg-blue-50 text-blue-700 border-blue-200" };
    }
    return { name: routedTo.replace(/_/g, " "), tagClass: "bg-slate-50 text-slate-700 border-slate-200" };
  };

  // Helper: Format Time
  const formatIncidentTime = (val?: string | number): { formatted: string; relative: string; dateOnly: string } => {
    if (!val) return { formatted: "Unknown", relative: "N/A", dateOnly: "" };
    let d: Date;
    if (typeof val === "number") {
      d = new Date(val);
    } else {
      d = new Date(val);
    }
    if (isNaN(d.getTime())) return { formatted: String(val), relative: "N/A", dateOnly: "" };

    const formatted = d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateOnly = `${year}-${month}-${day}`;

    // Relative time
    const diffMs = Date.now() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    let relative = "";
    if (diffSec < 60) relative = "Just now";
    else if (diffSec < 3600) relative = `${Math.floor(diffSec / 60)}m ago`;
    else if (diffSec < 86400) relative = `${Math.floor(diffSec / 3600)}h ago`;
    else relative = `${Math.floor(diffSec / 86400)}d ago`;

    return { formatted, relative, dateOnly };
  };

  // Actions: Mark Resolved
  const handleResolveIncident = async (id: number) => {
    setIsUpdatingStatus(id);
    try {
      const res = await fetch(API_ENDPOINTS.incidents.resolve(id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        showAlert(`Incident #INC-${id} marked as Resolved and moved to history.`, "success");
        await fetchIncidents();
        if (selectedIncident?.id === id) {
          setIsDetailModalOpen(false);
          setSelectedIncident(null);
        }
      } else {
        const err = await res.json().catch(() => null);
        showAlert(err?.message || `Failed to resolve incident #${id}.`, "error");
      }
    } catch {
      showAlert(`Network error updating incident #${id}.`, "error");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Actions: Update Status (e.g. Open to In Progress, or Reopen)
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setIsUpdatingStatus(id);
    try {
      const res = await fetch(API_ENDPOINTS.incidents.status(id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const formatted = newStatus.replace(/_/g, " ");
        if (newStatus === "RESOLVED") {
          showAlert(`Incident #INC-${id} marked as Resolved and moved to history.`, "success");
        } else {
          showAlert(`Incident #INC-${id} status changed to ${formatted}.`, "success");
        }
        await fetchIncidents();
        if (selectedIncident?.id === id) {
          const updated = incidents.find((i) => i.id === id);
          if (updated) setSelectedIncident({ ...updated, status: newStatus });
        }
      } else {
        showAlert("Failed to update status. Please try again.", "error");
      }
    } catch {
      showAlert("Network error during status update.", "error");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Actions: Create New Incident (for supervisor operational log)
  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsSubmittingNew(true);
    try {
      const res = await fetch(API_ENDPOINTS.incidents.base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim(),
          severity: newSeverity,
          location: newLocation.trim() || "Campus Perimeter",
          routedTo: newOffice,
          reporterName: user?.fullName || user?.name || "Supervisor Elena Rostova",
          reporterRole: "Shift Supervisor",
          reporterEmail: user?.email || "supervisor@campusguard.edu",
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        showAlert(`Incident #INC-${saved.id} successfully registered into active tracking.`, "success");
        setIsNewModalOpen(false);
        setNewTitle("");
        setNewDescription("");
        setNewLocation("");
        await fetchIncidents();
      } else {
        showAlert("Failed to create incident report.", "error");
      }
    } catch {
      showAlert("Network connection error recording incident.", "error");
    } finally {
      setIsSubmittingNew(false);
    }
  };

  // Separate Active Incidents vs Resolved History
  const activeIncidents = useMemo(() => {
    return incidents.filter((item) => isStatusOpenOrInProgress(item.status) && !isStatusResolved(item.status));
  }, [incidents]);

  const historyIncidents = useMemo(() => {
    return incidents.filter((item) => isStatusResolved(item.status));
  }, [incidents]);

  // Count metrics
  const activeCount = activeIncidents.length;
  const historyCount = historyIncidents.length;
  const openCount = activeIncidents.filter((i) => (i.status || "OPEN").toUpperCase() === "OPEN").length;
  const inProgressCount = activeIncidents.filter((i) => {
    const s = (i.status || "").toUpperCase();
    return s.includes("PROGRESS") || s === "DISPATCHED" || s === "IN_TRIAGE";
  }).length;
  const criticalActiveCount = activeIncidents.filter((i) => (i.severity || "").toUpperCase() === "CRITICAL").length;

  // Filtered List based on Current Tab and User Filters
  const displayedIncidents = useMemo(() => {
    const sourceList = activeTab === "active" ? activeIncidents : historyIncidents;

    return sourceList.filter((item) => {
      // 1. Severity filter
      if (severityFilter !== "ALL") {
        const itemSev = (item.severity || "").toUpperCase();
        if (severityFilter === "CRITICAL" && itemSev !== "CRITICAL") return false;
        if (severityFilter === "HIGH" && itemSev !== "HIGH" && itemSev !== "MAJOR") return false;
        if (severityFilter === "MEDIUM" && itemSev !== "MEDIUM" && itemSev !== "MODERATE") return false;
        if (severityFilter === "LOW" && itemSev !== "LOW" && itemSev !== "MINOR") return false;
      }

      // 2. Status filter
      if (statusFilter !== "ALL") {
        const s = (item.status || "OPEN").toUpperCase().replace(" ", "_");
        if (statusFilter === "OPEN" && s !== "OPEN") return false;
        if (statusFilter === "IN_PROGRESS" && s !== "IN_PROGRESS" && s !== "INPROGRESS" && s !== "DISPATCHED" && s !== "IN_TRIAGE") return false;
        if (statusFilter === "RESOLVED" && s !== "RESOLVED") return false;
      }

      // 3. Date filter (exact YYYY-MM-DD match against createdAt or resolvedAt)
      if (dateFilter) {
        const timeObj = formatIncidentTime(item.createdAt);
        const resolvedTimeObj = item.resolvedAt ? formatIncidentTime(item.resolvedAt) : null;
        const matchesCreated = timeObj.dateOnly === dateFilter;
        const matchesResolved = resolvedTimeObj?.dateOnly === dateFilter;
        if (!matchesCreated && !matchesResolved) {
          return false;
        }
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const numMatch = `#inc-${item.id}`.includes(q) || `#${item.id}`.includes(q) || String(item.id).includes(q);
        const titleMatch = (item.title || "").toLowerCase().includes(q);
        const descMatch = (item.description || "").toLowerCase().includes(q);
        const locMatch = (item.location || "").toLowerCase().includes(q);
        const repMatch = (item.reporterName || "").toLowerCase().includes(q) || (item.reporterEmail || "").toLowerCase().includes(q);
        const officeMatch = formatHandlingOffice(item.routedTo).name.toLowerCase().includes(q);

        if (!numMatch && !titleMatch && !descMatch && !locMatch && !repMatch && !officeMatch) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, activeIncidents, historyIncidents, severityFilter, statusFilter, dateFilter, searchQuery]);

  // Auth Loading Screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
          <Loader2 className="w-7 h-7 animate-spin text-blue-700" />
          <p>Verifying shift supervisor security clearance...</p>
        </div>
      </div>
    );
  }

  // Role Access Guard: Only Shift Supervisor
  if (user && user.role !== "Shift Supervisor") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Incident Tracking Screen is strictly authorized for <strong>Shift Supervisors</strong>. Your current authenticated role is <strong>{user.role}</strong>.
          </p>
          <div className="pt-2">
            <Link
              href={getRoleDashboardPath(user.role)}
              className="inline-block px-5 py-2.5 bg-[#0a2f77] text-white font-bold text-xs rounded-xl hover:bg-blue-900 transition"
            >
              Return to Your Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user?.fullName || user?.name || "Supervisor Elena Rostova";
  const displayBadge = user?.badgeNumber || "SS-104";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0a2f77] flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
                  CampusGuard
                </span>
                <span className="text-[10px] font-bold tracking-wider text-[#0a2f77] uppercase leading-tight mt-0.5">
                  SUPERVISOR PORTAL
                </span>
              </div>
            </Link>

            {/* Navigation Bar */}
            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold text-slate-600">
              <Link
                href="/dashboard/supervisor"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/supervisor/occurrence-register"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Occurrence Register
              </Link>
              <Link
                href="/dashboard/supervisor/incidents"
                className="py-5 relative transition cursor-pointer text-blue-700 font-bold border-b-2 border-blue-700"
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
              <Link
                href="/dashboard/supervisor/profile"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Profile
              </Link>
            </nav>
          </div>

          {/* Right Status & Profile */}
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Telemetry Live"></span>

            <Link href="/dashboard/supervisor/notifications" className="relative cursor-pointer" title="Alert Notifications">
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

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
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
                { name: "Occurrence Register", href: "/dashboard/supervisor/occurrence-register", icon: ClipboardList, active: false },
                { name: "Incident Tracking", href: "/dashboard/supervisor/incidents", icon: AlertTriangle, active: true },
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

        {/* MAIN INCIDENT TRACKING CONSOLE */}
        <main className="flex-1 space-y-5">
          {/* Action Notice Alert */}
          {actionNotice && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold flex items-center justify-between border shadow-2xs animate-in fade-in ${
                actionNotice.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : actionNotice.type === "error"
                  ? "bg-red-50 border-red-200 text-red-900"
                  : "bg-blue-50 border-blue-200 text-blue-900"
              }`}
            >
              <div className="flex items-center gap-2">
                {actionNotice.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {actionNotice.type === "error" && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                {actionNotice.type === "info" && <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0" />}
                <span>{actionNotice.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setActionNotice(null)}
                className="text-slate-500 hover:text-slate-800 font-bold ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* TELEMETRY HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-blue-800 uppercase">
                <span>• SHIFT SUPERVISOR INCIDENT DISPATCH COMMAND • REAL-TIME TRACKING</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Incident Tracking &amp; Triage Console
              </h1>
              <p className="text-xs text-slate-500">
                Live monitoring of open and in-progress field security incidents, multi-department office routing, and historical resolutions.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setIsNewModalOpen(true)}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log New Incident</span>
              </button>

              <button
                type="button"
                onClick={fetchIncidents}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200 cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${isLoadingIncidents ? "animate-spin" : ""}`} />
                <span>{isLoadingIncidents ? "Syncing..." : "Sync Live Feed"}</span>
              </button>
            </div>
          </div>

          {/* 4 STAT KPI TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Active Tracking (Open/In Progress)</span>
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">{activeCount}</span>
                <span className="text-[11px] font-bold text-blue-700">● In Main Feed</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {openCount} Open • {inProgressCount} In Progress
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Critical / High Priority</span>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-red-600 leading-none">{criticalActiveCount}</span>
                <span className="text-[11px] font-bold text-red-700">● Urgent Attention</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Immediate response required by watch officers
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Resolved Incident History</span>
                <History className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-700 leading-none">{historyCount}</span>
                <span className="text-[11px] font-bold text-emerald-700">● Archived</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Closed cases searchable in history vault
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Total Recorded Ledger</span>
                <Building2 className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">{incidents.length}</span>
                <span className="text-[11px] font-bold text-slate-600">● Master Database</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Synchronized with central database
              </p>
            </div>
          </div>

          {/* TAB TOGGLE: MAIN ACTIVE LIST vs RESOLVED HISTORY */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("active");
                  setStatusFilter("ALL");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "active"
                    ? "bg-[#0a2f77] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Active Incidents (Open &amp; In Progress)</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    activeTab === "active" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {activeCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("history");
                  setStatusFilter("ALL");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "history"
                    ? "bg-[#0a2f77] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Resolved History &amp; Archive</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    activeTab === "history" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {historyCount}
                </span>
              </button>
            </div>

            <div className="text-[11px] font-medium text-slate-500 hidden sm:block pr-3">
              {activeTab === "active"
                ? "Resolved incidents automatically move to searchable history."
                : "Search and inspect all historical resolved security events."}
            </div>
          </div>

          {/* FILTER BAR: SEVERITY, DATE, STATUS & SEARCH */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={
                    activeTab === "active"
                      ? "Search by incident #, title, location, reporter, handling office..."
                      : "Search historical records by incident #, title, location, reporter..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Severity Filter */}
                <div className="relative">
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="px-3 py-2 pr-7 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-pointer appearance-none shadow-2xs hover:border-blue-400"
                  >
                    <option value="ALL">All Severities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* 2. Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 pr-7 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-pointer appearance-none shadow-2xs hover:border-blue-400"
                  >
                    {activeTab === "active" ? (
                      <>
                        <option value="ALL">All Active (Open &amp; In Progress)</option>
                        <option value="OPEN">Open Only</option>
                        <option value="IN_PROGRESS">In Progress Only</option>
                      </>
                    ) : (
                      <>
                        <option value="ALL">All Resolved Incidents</option>
                        <option value="RESOLVED">Resolved Only</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* 3. Date Filter */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1 shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="text-xs text-slate-700 font-medium bg-transparent focus:outline-none cursor-pointer"
                  />
                  {dateFilter && (
                    <button
                      type="button"
                      onClick={() => setDateFilter("")}
                      title="Clear Date"
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Reset All Filters Button if any is active */}
                {(severityFilter !== "ALL" || statusFilter !== "ALL" || dateFilter || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSeverityFilter("ALL");
                      setStatusFilter("ALL");
                      setDateFilter("");
                      setSearchQuery("");
                    }}
                    className="px-2.5 py-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Active Filter Badges */}
            {(severityFilter !== "ALL" || statusFilter !== "ALL" || dateFilter || searchQuery) && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                <span className="font-bold">Active filters:</span>
                {severityFilter !== "ALL" && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                    Severity: {severityFilter}
                  </span>
                )}
                {statusFilter !== "ALL" && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                    Status: {statusFilter.replace(/_/g, " ")}
                  </span>
                )}
                {dateFilter && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                    Date: {dateFilter}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                    Query: &quot;{searchQuery}&quot;
                  </span>
                )}
              </div>
            )}
          </div>

          {/* THE INCIDENTS TRACKING TABLE */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">INCIDENT NUMBER</th>
                    <th className="py-3.5 px-3">SEVERITY</th>
                    <th className="py-3.5 px-4">LOCATION</th>
                    <th className="py-3.5 px-4">REPORTER</th>
                    <th className="py-3.5 px-4">TIME</th>
                    <th className="py-3.5 px-4">CURRENT OFFICE HANDLING IT</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {displayedIncidents.length > 0 ? (
                    displayedIncidents.map((row) => {
                      const sev = formatSeverityDisplay(row.severity);
                      const office = formatHandlingOffice(row.routedTo);
                      const timeInfo = formatIncidentTime(row.createdAt);
                      const statusInfo = formatStatusDisplay(row.status);
                      const isResolved = isStatusResolved(row.status);

                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-slate-50/80 transition cursor-pointer"
                          onClick={() => {
                            setSelectedIncident(row);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          {/* 1. INCIDENT NUMBER */}
                          <td className="py-4 px-4 font-mono font-bold text-blue-700">
                            <div className="flex items-center gap-2">
                              <span>#INC-{row.id}</span>
                            </div>
                            <div className="text-[11px] font-sans font-bold text-slate-800 line-clamp-1 mt-0.5">
                              {row.title}
                            </div>
                          </td>

                          {/* 2. SEVERITY */}
                          <td className="py-4 px-3" onClick={(e) => e.stopPropagation()}>
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${sev.badgeClass}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${sev.dotClass}`}></span>
                              <span>{sev.label}</span>
                            </span>
                          </td>

                          {/* 3. LOCATION */}
                          <td className="py-4 px-4 max-w-[200px]">
                            <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{row.location || "Campus Perimeter"}</span>
                            </div>
                            {row.description && (
                              <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {row.description}
                              </div>
                            )}
                          </td>

                          {/* 4. REPORTER */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{row.reporterName || "Duty Officer"}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 pl-5">
                              {row.reporterRole || "Campus Staff"}
                              {row.reporterEmail ? ` • ${row.reporterEmail}` : ""}
                            </div>
                          </td>

                          {/* 5. TIME */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{timeInfo.formatted}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 pl-5">
                              {timeInfo.relative}
                            </div>
                          </td>

                          {/* 6. CURRENT OFFICE HANDLING IT */}
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${office.tagClass}`}
                            >
                              <Building2 className="w-3 h-3 shrink-0" />
                              <span>{office.name}</span>
                            </span>
                          </td>

                          {/* 7. ACTIONS */}
                          <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2 flex-wrap">
                              {/* Status badge & dropdown */}
                              {!isResolved ? (
                                <>
                                  <select
                                    value={row.status?.toUpperCase().replace(" ", "_") || "OPEN"}
                                    onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
                                    disabled={isUpdatingStatus === row.id}
                                    className="px-2 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-blue-400 cursor-pointer disabled:opacity-50"
                                  >
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Mark Resolved</option>
                                  </select>

                                  <button
                                    type="button"
                                    onClick={() => handleResolveIncident(row.id)}
                                    disabled={isUpdatingStatus === row.id}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow-2xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                    title="Mark incident as Resolved and move to history"
                                  >
                                    {isUpdatingStatus === row.id ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Check className="w-3 h-3" />
                                    )}
                                    <span>Resolve</span>
                                  </button>
                                </>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    ● Resolved
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateStatus(row.id, "IN_PROGRESS")}
                                    disabled={isUpdatingStatus === row.id}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] rounded-lg cursor-pointer"
                                    title="Reopen incident back to active list"
                                  >
                                    Reopen
                                  </button>
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedIncident(row);
                                  setIsDetailModalOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                                title="View full incident details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <AlertTriangle className="w-8 h-8 text-slate-300" />
                          <p className="font-bold text-slate-700 text-sm">
                            {activeTab === "active"
                              ? "No active incidents matching the current filters."
                              : "No resolved incidents found in history."}
                          </p>
                          <p className="text-xs text-slate-400 max-w-sm">
                            {activeTab === "active"
                              ? "When new incidents are reported with status Open or In progress, they will appear here in real time."
                              : "When an incident is marked Resolved, it is archived here and remains fully searchable."}
                          </p>
                          {(severityFilter !== "ALL" || statusFilter !== "ALL" || dateFilter || searchQuery) && (
                            <button
                              type="button"
                              onClick={() => {
                                setSeverityFilter("ALL");
                                setStatusFilter("ALL");
                                setDateFilter("");
                                setSearchQuery("");
                              }}
                              className="mt-2 text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                            >
                              Reset filters to show all records
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                Showing <strong>{displayedIncidents.length}</strong> of{" "}
                <strong>{activeTab === "active" ? activeCount : historyCount}</strong>{" "}
                {activeTab === "active" ? "active tracking records" : "resolved history records"}
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Live Database Synced
                </span>
              </div>
            </div>
          </div>

          {/* INCIDENT DETAILS MODAL */}
          {isDetailModalOpen && selectedIncident && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-700 text-sm">
                      #INC-{selectedIncident.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        formatSeverityDisplay(selectedIncident.severity).badgeClass
                      }`}
                    >
                      {formatSeverityDisplay(selectedIncident.severity).label}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setSelectedIncident(null);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {selectedIncident.title}
                    </h3>
                  </div>

                  {/* Narrative details */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      INCIDENT NARRATIVE / FIELD OBSERVATIONS
                    </div>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedIncident.description || "No tactical details recorded by reporter."}
                    </p>
                  </div>

                  {/* Key metadata grid */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Location</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {selectedIncident.location || "Perimeter"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Reporter</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {selectedIncident.reporterName || "Campus Guard"}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {selectedIncident.reporterRole || "Security"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Office Handling</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {formatHandlingOffice(selectedIncident.routedTo).name}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Reported Time</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatIncidentTime(selectedIncident.createdAt).formatted}
                      </span>
                    </div>
                  </div>

                  {selectedIncident.resolvedAt && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>
                        Resolved on {formatIncidentTime(selectedIncident.resolvedAt).formatted}
                      </span>
                    </div>
                  )}
                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Status:</span>
                    <select
                      value={selectedIncident.status?.toUpperCase().replace(" ", "_") || "OPEN"}
                      onChange={(e) => handleUpdateStatus(selectedIncident.id, e.target.value)}
                      disabled={isUpdatingStatus === selectedIncident.id}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-700 cursor-pointer hover:border-blue-500"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isStatusResolved(selectedIncident.status) && (
                      <button
                        type="button"
                        onClick={() => handleResolveIncident(selectedIncident.id)}
                        disabled={isUpdatingStatus === selectedIncident.id}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isUpdatingStatus === selectedIncident.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>Mark as Resolved</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        setSelectedIncident(null);
                      }}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LOG NEW INCIDENT MODAL */}
          {isNewModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Log Operational Field Incident</span>
                  </h3>
                  <button onClick={() => setIsNewModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateIncident} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Incident Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Broken Lock at West Quad Lab"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Severity</label>
                      <select
                        value={newSeverity}
                        onChange={(e) => setNewSeverity(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      >
                        <option value="CRITICAL">Critical</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Office Handling</label>
                      <select
                        value={newOffice}
                        onChange={(e) => setNewOffice(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      >
                        <option value="CENTRAL_DISPATCH">Central Dispatch &amp; NOC</option>
                        <option value="SHIFT_SUPERVISOR_COMMAND">Shift Supervisor Command</option>
                        <option value="PROCTOR_AND_DSW">Proctor &amp; DSW Desk</option>
                        <option value="FACILITIES_AND_SAFETY">Facilities &amp; Campus Safety</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Location / Zone</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Science Library Room 204"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Field Narrative / Details</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Document initial officer observations, perimeter response, involved parties..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setIsNewModalOpen(false)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingNew}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingNew ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>Save &amp; Track Incident</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
