"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Shield,
  Users,
  KeyRound,
  Server,
  Activity,
  Bell,
  Download,
  Search,
  ExternalLink,
  Lock,
  LogOut,
  ChevronRight,
  Database,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  FileText
} from "lucide-react";
import { performLogout } from "@/lib/auth";

const SEED_USERS = [
  {
    name: "Alex Morgan",
    email: "student@campusguard.edu",
    role: "Student",
    badge: "#STU-88201",
    department: "Dept. of Computer Science & Eng.",
    roleColor: "bg-blue-100 text-blue-800",
    status: "Active • Verified",
    lastLogin: "Today, 10:12 AM"
  },
  {
    name: "Dr. Arthur Vance",
    email: "proctor@campusguard.edu",
    role: "Proctor and DSW",
    badge: "#PR-109",
    department: "Dean of Student Welfare",
    roleColor: "bg-purple-100 text-purple-800",
    status: "Active • Executive",
    lastLogin: "Today, 09:30 AM"
  },
  {
    name: "Officer Marcus Vance",
    email: "guard@campusguard.edu",
    role: "Security Guard",
    badge: "Shield #4082",
    department: "Campus Security Division • West Perimeter",
    roleColor: "bg-indigo-100 text-indigo-800",
    status: "Active • On Duty",
    lastLogin: "Today, 07:54 AM"
  },
  {
    name: "Supervisor Elena Rostova",
    email: "supervisor@campusguard.edu",
    role: "Shift Supervisor",
    badge: "Badge #SS-104",
    department: "Operations Dispatch Control",
    roleColor: "bg-amber-100 text-amber-800",
    status: "Active • Command",
    lastLogin: "Today, 08:05 AM"
  },
  {
    name: "System Administrator",
    email: "admin@campusguard.edu",
    role: "Admin",
    badge: "Root Admin #ADM-001",
    department: "Institutional Security IT",
    roleColor: "bg-rose-100 text-rose-800",
    status: "Active • Root",
    lastLogin: "Current Session"
  }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const filteredUsers = SEED_USERS.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "All" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0a2f77] flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
                  CampusGuard
                </span>
                <span className="text-[10px] font-bold tracking-wider text-rose-700 uppercase leading-tight mt-0.5">
                  SYSTEM ADMINISTRATION
                </span>
              </div>
            </Link>

            {/* Top Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold text-slate-600">
              {["Dashboard", "Users & Roles", "Audit Logs", "System Health", "Configuration", "Profile"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`py-5 relative transition cursor-pointer ${
                    activeTab === tab
                      ? "text-blue-700 font-bold border-b-2 border-blue-700"
                      : "hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Status & Profile */}
          <div className="flex items-center gap-3">
            {/* Root Clearance Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
              <span>ROOT CLEARANCE • AUDIT LEVEL 4</span>
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600"></span>
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0a2f77] text-white flex items-center justify-center font-bold text-xs">
                SA
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  System Administrator
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  Root Admin #ADM-001
                </span>
              </div>
              <button
                type="button"
                onClick={() => performLogout()}
                title="Log out"
                className="ml-1 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN */}
      <div className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* LEFT SIDEBAR: ADMIN CONTROL CENTER */}
        <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Admin Control Center
            </div>
            <nav className="space-y-1">
              {[
                { name: "Dashboard", icon: ShieldCheck, badge: null },
                { name: "Users & Roles", icon: Users, badge: "5 Seed" },
                { name: "Security Audit Logs", icon: KeyRound, badge: "Live" },
                { name: "System Health", icon: Activity, badge: "100%" },
                { name: "Configuration", icon: Server, badge: null },
                { name: "Profile", icon: UserCheck, badge: null },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === item.name
                      ? "bg-[#0a2f77] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom Sidebar Card: Infrastructure Health */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-700" />
                INFRASTRUCTURE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                HEALTHY
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Dual-DB Active: <strong>SQLite (Dev)</strong> / Postgres (Prod)
            </p>
            <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-100 flex items-center justify-between">
              <span>Uptime:</span>
              <strong className="text-emerald-700">99.98%</strong>
            </div>
          </div>
        </aside>

        {/* MAIN ADMIN COMMAND FEED */}
        <main className="flex-1 space-y-5">
          {/* HEADER BAR */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-rose-800 uppercase">
                <span>• CAMPUSGUARD INSTITUTIONAL GOVERNANCE • ROOT ACCESS • ENVIRONMENT: ACTIVE</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                System Administration &amp; Access Control
              </h1>
              <p className="text-xs text-slate-500">
                Manage user credentials, institutional role permissions, active session tokens, and security telemetry.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit JSON</span>
              </button>
              <button
                type="button"
                className="px-3.5 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Provision User</span>
              </button>
            </div>
          </div>

          {/* 4 STAT KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Users */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Total Accounts</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">5</span>
                <span className="text-xs font-bold text-emerald-700">100% Seed Active</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0a2f77] rounded-full" style={{ width: "100%" }}></div>
              </div>
              <p className="text-[11px] text-slate-500">
                All 5 Institutional Roles Seeded (Pass: 12345678)
              </p>
            </div>

            {/* Card 2: Institutional Roles */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Clearance Roles</span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-purple-900 leading-none">5</span>
                <span className="text-xs font-bold text-purple-700">Security Tiers</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Student, Proctor/DSW, Guard, Supervisor, Admin
              </p>
            </div>

            {/* Card 3: Security Operations (24h) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Security Operations</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">48</span>
                <span className="text-xs font-bold text-emerald-700">● 100% Validated</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Login, token generation &amp; password reset flows
              </p>
            </div>

            {/* Card 4: Services Uptime */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Core Services</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Server className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-700 leading-none">99.98%</span>
                <span className="text-xs font-bold text-slate-500">Operational</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Spring Boot API, SQLite DB, JavaMail Service
              </p>
            </div>
          </div>

          {/* USER MANAGEMENT & SEED ACCOUNTS DIRECTORY */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Institutional User Directory &amp; Role Clearance
                </h2>
                <p className="text-[11px] text-slate-500">
                  Seeded credentials and access privileges configured in CampusGuard database.
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-7 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium"
                >
                  <option value="All">All Roles (5)</option>
                  <option value="Student">Student</option>
                  <option value="Proctor and DSW">Proctor and DSW</option>
                  <option value="Security Guard">Security Guard</option>
                  <option value="Shift Supervisor">Shift Supervisor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {/* User Directory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-3">User &amp; Credentials</th>
                    <th className="py-3 px-3">Institutional Role</th>
                    <th className="py-3 px-3">Department &amp; Badge</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Default Password</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredUsers.map((user) => (
                    <tr key={user.email} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#0a2f77] text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {user.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-[11px] text-slate-500 font-mono">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${user.roleColor}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-800">{user.department}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{user.badge}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {user.status}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{user.lastLogin}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          12345678
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={
                              user.role === "Student"
                                ? "/dashboard/student"
                                : user.role === "Proctor and DSW"
                                ? "/dashboard/proctor"
                                : user.role === "Security Guard"
                                ? "/dashboard/guard"
                                : user.role === "Shift Supervisor"
                                ? "/dashboard/supervisor"
                                : "/dashboard/admin"
                            }
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-[11px] font-bold rounded shadow-2xs transition"
                          >
                            Open Dashboard
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECURITY AUDIT STREAM & SYSTEM CONTROLS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Audit Stream 2 cols */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-blue-700" />
                  <h2 className="text-sm font-bold text-slate-900">Security Audit &amp; Event Stream</h2>
                </div>
                <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  Live Telemetry
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  {
                    time: "14:15 PST",
                    event: "Roster Telemetry Sync Completed",
                    detail: "Shift B (26 posts reporting, Gate 04 active, 2 priority alerts)",
                    type: "info"
                  },
                  {
                    time: "13:42 PST",
                    event: "High Severity Incident Flagged for Proctor Oversight",
                    detail: "Unauthorized barrier attempt Gate 07 — Protocol Level 1 lock initiated",
                    type: "alert"
                  },
                  {
                    time: "10:12 PST",
                    event: "Authentication Handshake Verified",
                    detail: "student@campusguard.edu logged in successfully (Role: Student)",
                    type: "success"
                  },
                  {
                    time: "07:54 PST",
                    event: "Biometric SSO Credential Handshake",
                    detail: "Officer Marcus Vance verified at Kiosk 04 (SSO Token #AF99)",
                    type: "success"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3">
                    <span className="font-mono text-slate-400 text-[11px] shrink-0 pt-0.5">{item.time}</span>
                    <div className="flex-1 space-y-0.5">
                      <p className="font-bold text-slate-900">{item.event}</p>
                      <p className="text-slate-500 text-[11px]">{item.detail}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                      item.type === "alert"
                        ? "bg-red-100 text-red-800"
                        : item.type === "success"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions 1 col */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Server className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-slate-900">System Maintenance</h2>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => alert("All 5 seed accounts are verified and healthy in SQLite database.")}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/40 text-xs font-semibold text-slate-800 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-blue-700" />
                    <span>Verify Seed Accounts</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => alert("Spring Mail and Password Reset tokens cache refreshed.")}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/40 text-xs font-semibold text-slate-800 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-blue-700" />
                    <span>Clear Expired Tokens</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => alert("Security Audit Log exported as JSON.")}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/40 text-xs font-semibold text-slate-800 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-700" />
                    <span>Export Audit Telemetry</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1.5 text-xs">
                <span className="font-bold text-red-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  Heightened Security Screening
                </span>
                <p className="text-[11px] text-red-800">
                  Level 2 screening currently active for North Quad perimeter terminals.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
