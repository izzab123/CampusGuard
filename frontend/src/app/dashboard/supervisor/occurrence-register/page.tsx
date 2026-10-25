"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ClipboardList,
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
  Lock,
  MessageSquare,
  Send,
  FileText,
  Radio,
  FileCheck2
} from "lucide-react";
import { getStoredAuthUser, performLogout, AuthUser, getRoleDashboardPath } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

export interface OccurrenceRemarkItem {
  id: number;
  occurrenceId: number;
  authorName: string;
  authorBadge?: string;
  authorRole?: string;
  authorEmail?: string;
  remarkText: string;
  createdAt: string;
}

export interface OccurrenceItem {
  id: number;
  date: string;
  occurrenceDate: string;
  guard: string;
  guardName: string;
  guardBadgeNumber?: string;
  guardEmail?: string;
  shift: string;
  shiftType: string;
  gate: string;
  gatePost: string;
  type: string;
  occurrenceType: string;
  severity?: string;
  title: string;
  description: string;
  source?: string;
  readOnly: boolean;
  createdAt: string;
  remarks: OccurrenceRemarkItem[];
}

export default function OccurrenceRegisterPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [occurrences, setOccurrences] = useState<OccurrenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Filters: Date Range, Guard, Type, and Text Query
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedGuard, setSelectedGuard] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Entry Details Modal & Append Remark State
  const [selectedEntry, setSelectedEntry] = useState<OccurrenceItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newRemarkText, setNewRemarkText] = useState("");
  const [isSubmittingRemark, setIsSubmittingRemark] = useState(false);

  useEffect(() => {
    const authUser = getStoredAuthUser();
    if (!authUser) {
      router.replace("/login");
      return;
    }
    setUser(authUser);
    setIsAuthLoading(false);

    if (authUser.role === "Shift Supervisor") {
      fetchOccurrences();
    }
  }, [router]);

  const fetchOccurrences = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.occurrenceRegister.base, {
        headers: {
          "X-User-Role": "Shift Supervisor",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOccurrences(Array.isArray(data) ? data : []);
      } else {
        showAlert("Failed to retrieve occurrence register records from dispatch.", "error");
      }
    } catch {
      showAlert("Network connection error connecting to occurrence register API.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (message: string, type: "success" | "error" | "info" = "info") => {
    setActionNotice({ message, type });
    setTimeout(() => {
      setActionNotice(null);
    }, 4500);
  };

  // Helper: Format Occurrence Type Badge
  const formatTypeBadge = (type?: string): { label: string; badgeClass: string; dotClass: string } => {
    const t = (type || "").toUpperCase().replace(" ", "_");
    if (t === "NO_SHOW" || t.includes("NO_SHOW")) {
      return {
        label: "No-Show",
        badgeClass: "bg-rose-50 text-rose-800 border-rose-300 font-extrabold",
        dotClass: "bg-rose-600 animate-pulse",
      };
    }
    if (t === "NOTABLE_EVENT" || t.includes("NOTABLE")) {
      return {
        label: "Notable Event",
        badgeClass: "bg-purple-50 text-purple-800 border-purple-300 font-extrabold",
        dotClass: "bg-purple-600",
      };
    }
    if (t.includes("BREACH") || t.includes("SECURITY")) {
      return {
        label: "Security Alert",
        badgeClass: "bg-red-50 text-red-800 border-red-300 font-extrabold",
        dotClass: "bg-red-600",
      };
    }
    return {
      label: type || "Occurrence",
      badgeClass: "bg-blue-50 text-blue-800 border-blue-200 font-bold",
      dotClass: "bg-blue-600",
    };
  };

  // Helper: Format Date
  const formatDateDisplay = (dateVal?: string): string => {
    if (!dateVal) return "N/A";
    const d = new Date(dateVal.includes("T") ? dateVal : `${dateVal}T00:00:00`);
    if (isNaN(d.getTime())) return dateVal;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper: Format Remark Timestamp
  const formatRemarkTime = (ts?: string): string => {
    if (!ts) return "";
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Extract distinct guards for filter dropdown
  const uniqueGuards = useMemo(() => {
    const guards = new Set<string>();
    occurrences.forEach((o) => {
      if (o.guardName) guards.add(o.guardName);
      else if (o.guard) guards.add(o.guard);
    });
    return Array.from(guards);
  }, [occurrences]);

  // Filter Occurrences based on Date Range, Guard, Type, and Query
  const filteredOccurrences = useMemo(() => {
    return occurrences.filter((item) => {
      // 1. Date Range Filter
      const itemDate = item.occurrenceDate || item.date;
      if (startDate && itemDate < startDate) {
        return false;
      }
      if (endDate && itemDate > endDate) {
        return false;
      }

      // 2. Guard Filter
      if (selectedGuard !== "ALL") {
        const guardStr = (item.guardName || item.guard || "").toLowerCase();
        if (!guardStr.includes(selectedGuard.toLowerCase())) {
          return false;
        }
      }

      // 3. Occurrence Type Filter
      if (selectedType !== "ALL") {
        const typeStr = (item.occurrenceType || item.type || "").toUpperCase().replace(" ", "_");
        if (selectedType === "NO_SHOW" && !typeStr.includes("NO_SHOW")) {
          return false;
        }
        if (selectedType === "NOTABLE_EVENT" && !typeStr.includes("NOTABLE")) {
          return false;
        }
      }

      // 4. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const idMatch = `#occ-${item.id}`.includes(q) || String(item.id).includes(q);
        const guardMatch = (item.guardName || item.guard || "").toLowerCase().includes(q);
        const gateMatch = (item.gatePost || item.gate || "").toLowerCase().includes(q);
        const shiftMatch = (item.shiftType || item.shift || "").toLowerCase().includes(q);
        const titleMatch = (item.title || "").toLowerCase().includes(q);
        const descMatch = (item.description || "").toLowerCase().includes(q);
        const typeMatch = (item.occurrenceType || item.type || "").toLowerCase().includes(q);

        if (!idMatch && !guardMatch && !gateMatch && !shiftMatch && !titleMatch && !descMatch && !typeMatch) {
          return false;
        }
      }

      return true;
    });
  }, [occurrences, startDate, endDate, selectedGuard, selectedType, searchQuery]);

  // Open entry modal and fetch full details
  const handleOpenEntry = async (id: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.occurrenceRegister.byId(id), {
        headers: {
          "X-User-Role": "Shift Supervisor",
        },
      });
      if (res.ok) {
        const fullData = await res.json();
        setSelectedEntry(fullData);
        setIsDetailModalOpen(true);
      } else {
        showAlert(`Failed to fetch details for entry #OCC-${id}.`, "error");
      }
    } catch {
      showAlert(`Network error loading entry details.`, "error");
    }
  };

  // Append Follow-Up Remark
  const handleAppendRemark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntry || !newRemarkText.trim()) return;

    setIsSubmittingRemark(true);
    try {
      const authorName = user?.fullName || user?.name || "Supervisor Elena Rostova";
      const authorBadge = user?.badgeNumber || "SS-104";
      const authorRole = user?.role || "Shift Supervisor";
      const authorEmail = user?.email || "supervisor@campusguard.edu";

      const res = await fetch(API_ENDPOINTS.occurrenceRegister.addRemark(selectedEntry.id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "Shift Supervisor",
          "X-User-Name": authorName,
          "X-User-Badge": authorBadge,
          "X-User-Email": authorEmail,
        },
        body: JSON.stringify({
          remark: newRemarkText.trim(),
          authorName,
          authorBadge,
          authorRole,
          authorEmail,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedEntry(updated);
        setNewRemarkText("");
        showAlert(`Follow-up remark successfully appended to Occurrence #OCC-${selectedEntry.id}.`, "success");
        await fetchOccurrences();
      } else {
        const err = await res.json().catch(() => null);
        showAlert(err?.error || "Failed to append remark.", "error");
      }
    } catch {
      showAlert("Network error submitting remark.", "error");
    } finally {
      setIsSubmittingRemark(false);
    }
  };

  // Auth Guard Screen
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
            The Official Occurrence Register is strictly authorized for <strong>Shift Supervisors</strong>. Your current authenticated role is <strong>{user.role}</strong>.
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

  const noShowCount = occurrences.filter((o) => (o.occurrenceType || o.type || "").toUpperCase().includes("NO_SHOW")).length;
  const notableCount = occurrences.filter((o) => (o.occurrenceType || o.type || "").toUpperCase().includes("NOTABLE")).length;
  const totalRemarksCount = occurrences.reduce((acc, curr) => acc + (curr.remarks ? curr.remarks.length : 0), 0);

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
                className="py-5 relative transition cursor-pointer text-blue-700 font-bold border-b-2 border-blue-700"
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
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Official Register • Read-Only Enforced</span>
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
                { name: "Occurrence Register", href: "/dashboard/supervisor/occurrence-register", icon: ClipboardList, active: true },
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

        {/* MAIN OCCURRENCE REGISTER CONTENT */}
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
                <span>• SHIFT SUPERVISOR OCCURRENCE REGISTER • OFFICIAL GOVERNANCE LEDGER</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Official Occurrence Register
              </h1>
              <p className="text-xs text-slate-500">
                Official log of unexcused guard no-shows and notable security occurrences. Entries are strictly read-only with chronological supervisor follow-up remarks.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={fetchOccurrences}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200 cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? "animate-spin" : ""}`} />
                <span>{isLoading ? "Syncing Register..." : "Sync Live Register"}</span>
              </button>
            </div>
          </div>

          {/* 3 STAT KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Guard No-Show Occurrences</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-rose-600 leading-none">{noShowCount}</span>
                <span className="text-[11px] font-bold text-rose-700">● Unstaffed Posts</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Automated sentinel flags for duty absences
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Notable Security Events</span>
                <Activity className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-purple-700 leading-none">{notableCount}</span>
                <span className="text-[11px] font-bold text-purple-700">● Station Events</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Breach attempts, power trips &amp; hazmat alerts
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Follow-Up Remarks Appended</span>
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-blue-700 leading-none">{totalRemarksCount}</span>
                <span className="text-[11px] font-bold text-blue-700">● Supervisor Notes</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Separate follow-up comments on official log
              </p>
            </div>
          </div>

          {/* FILTER BAR: DATE RANGE, GUARD, TYPE & SEARCH */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Search query input */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search register by guard, gate, shift, title, narrative..."
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
                {/* 1. Date Range: Start Date & End Date */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1 shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-400">From:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-xs text-slate-700 font-medium bg-transparent focus:outline-none cursor-pointer"
                  />
                  <span className="text-[11px] font-bold text-slate-400">To:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-xs text-slate-700 font-medium bg-transparent focus:outline-none cursor-pointer"
                  />
                  {(startDate || endDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setStartDate("");
                        setEndDate("");
                      }}
                      title="Clear Date Range"
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* 2. Guard Filter */}
                <div className="relative">
                  <select
                    value={selectedGuard}
                    onChange={(e) => setSelectedGuard(e.target.value)}
                    className="px-3 py-2 pr-7 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-pointer appearance-none shadow-2xs hover:border-blue-400"
                  >
                    <option value="ALL">All Guards</option>
                    {uniqueGuards.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* 3. Type Filter */}
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 pr-7 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold cursor-pointer appearance-none shadow-2xs hover:border-blue-400"
                  >
                    <option value="ALL">All Occurrence Types</option>
                    <option value="NO_SHOW">No-Show Only</option>
                    <option value="NOTABLE_EVENT">Notable Events Only</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Reset Filters */}
                {(startDate || endDate || selectedGuard !== "ALL" || selectedType !== "ALL" || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                      setSelectedGuard("ALL");
                      setSelectedType("ALL");
                      setSearchQuery("");
                    }}
                    className="px-2.5 py-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters Pill Bar */}
            {(startDate || endDate || selectedGuard !== "ALL" || selectedType !== "ALL" || searchQuery) && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                <span className="font-bold">Active filters:</span>
                {startDate && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                    From: {startDate}
                  </span>
                )}
                {endDate && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                    To: {endDate}
                  </span>
                )}
                {selectedGuard !== "ALL" && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                    Guard: {selectedGuard}
                  </span>
                )}
                {selectedType !== "ALL" && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                    Type: {selectedType.replace(/_/g, " ")}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                    Search: &quot;{searchQuery}&quot;
                  </span>
                )}
              </div>
            )}
          </div>

          {/* OFFICIAL OCCURRENCE REGISTER TABLE */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">DATE</th>
                    <th className="py-3.5 px-4">GUARD</th>
                    <th className="py-3.5 px-4">SHIFT</th>
                    <th className="py-3.5 px-4">GATE</th>
                    <th className="py-3.5 px-4">TYPE OF OCCURRENCE</th>
                    <th className="py-3.5 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredOccurrences.length > 0 ? (
                    filteredOccurrences.map((row) => {
                      const typeBadge = formatTypeBadge(row.occurrenceType || row.type);
                      const displayDate = formatDateDisplay(row.occurrenceDate || row.date);
                      const guardDisplay = row.guard || row.guardName;
                      const gateDisplay = row.gate || row.gatePost;
                      const shiftDisplay = row.shift || row.shiftType;
                      const remarksCount = row.remarks ? row.remarks.length : 0;

                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-slate-50/80 transition cursor-pointer"
                          onClick={() => handleOpenEntry(row.id)}
                        >
                          {/* 1. DATE */}
                          <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{displayDate}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              #OCC-{row.id}
                            </div>
                          </td>

                          {/* 2. GUARD */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{row.guardName || guardDisplay}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 pl-5">
                              {row.guardBadgeNumber ? row.guardBadgeNumber : "Shield Verified"}
                            </div>
                          </td>

                          {/* 3. SHIFT */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800">
                              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{shiftDisplay}</span>
                            </div>
                          </td>

                          {/* 4. GATE */}
                          <td className="py-4 px-4 max-w-[220px]">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{gateDisplay}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {row.title}
                            </div>
                          </td>

                          {/* 5. TYPE OF OCCURRENCE */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] border ${typeBadge.badgeClass}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${typeBadge.dotClass}`}></span>
                                <span>{typeBadge.label}</span>
                              </span>

                              {remarksCount > 0 && (
                                <span
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100"
                                  title={`${remarksCount} supervisor follow-up remarks appended`}
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>{remarksCount}</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 6. ACTION */}
                          <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleOpenEntry(row.id)}
                              className="px-3 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5 ml-auto cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Open Entry</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <ClipboardList className="w-8 h-8 text-slate-300" />
                          <p className="font-bold text-slate-700 text-sm">
                            No occurrence records matching current filter criteria.
                          </p>
                          <p className="text-xs text-slate-400 max-w-sm">
                            Try adjusting your date range, guard selection, or occurrence type filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                Showing <strong>{filteredOccurrences.length}</strong> of <strong>{occurrences.length}</strong> official occurrence register entries
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Original register records are cryptographically sealed &amp; strictly read-only</span>
              </div>
            </div>
          </div>

          {/* OCCURRENCE ENTRY DETAILS & APPEND REMARKS MODAL */}
          {isDetailModalOpen && selectedEntry && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-blue-700 text-sm">
                      #OCC-{selectedEntry.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] border ${
                        formatTypeBadge(selectedEntry.occurrenceType || selectedEntry.type).badgeClass
                      }`}
                    >
                      {formatTypeBadge(selectedEntry.occurrenceType || selectedEntry.type).label}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                      <Lock className="w-3 h-3 text-slate-500" />
                      <span>Strictly Read-Only Original Entry</span>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setSelectedEntry(null);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 1. STRICTLY READ-ONLY ORIGINAL ENTRY DETAILS */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {selectedEntry.title}
                    </h3>
                  </div>

                  {/* Metadata grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Date</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDateDisplay(selectedEntry.occurrenceDate || selectedEntry.date)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Guard</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3 text-slate-400" />
                        {selectedEntry.guardName || selectedEntry.guard}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {selectedEntry.guardBadgeNumber || "Shield Verified"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Shift</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {selectedEntry.shiftType || selectedEntry.shift}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Gate / Post</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{selectedEntry.gatePost || selectedEntry.gate}</span>
                      </span>
                    </div>
                  </div>

                  {/* Original Narrative (Read-Only) */}
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      <span>ORIGINAL REGISTER RECORD DETAILS</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        IMMUTABLE
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                      {selectedEntry.description || "No tactical details recorded."}
                    </p>
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Source: {selectedEntry.source || "Official Sentinel Log"}</span>
                      <span>Recorded: {formatRemarkTime(selectedEntry.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* 2. SUPERVISOR FOLLOW-UP REMARKS THREAD */}
                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
                      <span>Supervisor Follow-Up Remarks &amp; Notes</span>
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[10px]">
                      {selectedEntry.remarks ? selectedEntry.remarks.length : 0} Remarks
                    </span>
                  </div>

                  {/* List of existing remarks */}
                  <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                    {selectedEntry.remarks && selectedEntry.remarks.length > 0 ? (
                      selectedEntry.remarks.map((rem, idx) => (
                        <div
                          key={rem.id || idx}
                          className="bg-blue-50/40 border border-blue-200/70 rounded-xl p-3 space-y-1.5 text-xs animate-in fade-in"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                              <span>{rem.authorName}</span>
                              <span className="text-[10px] font-normal text-slate-500">
                                ({rem.authorRole || "Shift Supervisor"}{rem.authorBadge ? ` • ${rem.authorBadge}` : ""})
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {formatRemarkTime(rem.createdAt)}
                            </span>
                          </div>
                          <p className="text-slate-800 leading-relaxed font-medium pl-3 border-l-2 border-blue-400">
                            {rem.remarkText}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
                        No follow-up remarks appended yet. Use the form below to append official supervisor remarks.
                      </div>
                    )}
                  </div>

                  {/* Form to append a new follow-up remark */}
                  <form onSubmit={handleAppendRemark} className="space-y-2.5 pt-2 border-t border-slate-100">
                    <label className="font-bold text-slate-700 text-xs block">
                      Append Separate Follow-Up Remark
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Record investigation findings, guard contact notes, reliever assignment confirmations..."
                      value={newRemarkText}
                      onChange={(e) => setNewRemarkText(e.target.value)}
                      className="w-full p-2.5 text-xs border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none bg-slate-50/50 focus:bg-white"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] text-slate-500">
                        Posting as: <strong>{displayName}</strong> ({displayBadge})
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingRemark || !newRemarkText.trim()}
                        className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingRemark ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Append Follow-Up Remark</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Modal Close */}
                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setSelectedEntry(null);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Close Dossier
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
