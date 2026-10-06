"use client";

import React, { useState } from "react";
import {
  Users,
  Shield,
  Activity,
  Download,
  UserPlus,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Ban,
  Smartphone,
  Key,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface UserDirectoryItem {
  id: string;
  name: string;
  isCurrentUser?: boolean;
  avatarText: string;
  avatarBg: string;
  email: string;
  identifier: string;
  role: string;
  rolePillBg: string;
  department: string;
  badgeDetail: string;
  isRootDept?: boolean;
  status: string;
  statusDotColor: string;
  authMethod: string;
  authIcon: "app" | "fido" | "bio" | "push" | "yubikey" | "shield";
}

const DIRECTORY_USERS: UserDirectoryItem[] = [
  {
    id: "user-1",
    name: "Alex Morgan",
    avatarText: "AM",
    avatarBg: "bg-blue-100 text-blue-800",
    email: "student@campusguard.edu",
    identifier: "#STU-88201",
    role: "Student",
    rolePillBg: "bg-blue-100 text-blue-800",
    department: "Dept. of Computer Science & Eng.",
    badgeDetail: "Undergraduate Cohort 2026",
    status: "Active • Verified",
    statusDotColor: "bg-blue-600",
    authMethod: "App Authenticator",
    authIcon: "app",
  },
  {
    id: "user-2",
    name: "Dr. Arthur Vance",
    avatarText: "AV",
    avatarBg: "bg-purple-100 text-purple-800",
    email: "proctor@campusguard.edu",
    identifier: "#PR-109",
    role: "Proctor and DSW",
    rolePillBg: "bg-purple-100 text-purple-800",
    department: "Dean of Student Welfare Office",
    badgeDetail: "Executive Clearance PR-109",
    status: "Active • Executive",
    statusDotColor: "bg-blue-600",
    authMethod: "FIDO Hardware Key",
    authIcon: "fido",
  },
  {
    id: "user-3",
    name: "Officer Marcus Vance",
    avatarText: "MV",
    avatarBg: "bg-indigo-100 text-indigo-800",
    email: "guard@campusguard.edu",
    identifier: "#GRD-4082",
    role: "Security Guard",
    rolePillBg: "bg-indigo-100 text-indigo-800",
    department: "Campus Security Division",
    badgeDetail: "West Perimeter • Shield #4082",
    status: "Active • On Duty (Shift A)",
    statusDotColor: "bg-blue-600",
    authMethod: "Biometric Keycard",
    authIcon: "bio",
  },
  {
    id: "user-4",
    name: "Supervisor Elena Rostova",
    avatarText: "ER",
    avatarBg: "bg-slate-200 text-slate-800",
    email: "supervisor@campusguard.edu",
    identifier: "#SS-104",
    role: "Shift Supervisor",
    rolePillBg: "bg-slate-100 text-slate-700",
    department: "Operations Dispatch Control",
    badgeDetail: "Dispatch Officer Badge #SS-104",
    status: "Active • Command",
    statusDotColor: "bg-blue-600",
    authMethod: "Duo Mobile Push",
    authIcon: "push",
  },
  {
    id: "user-5",
    name: "System Administrator",
    isCurrentUser: true,
    avatarText: "SA",
    avatarBg: "bg-rose-100 text-rose-800",
    email: "admin@campusguard.edu",
    identifier: "#ADM-001",
    role: "System Admin",
    rolePillBg: "bg-rose-100 text-rose-800",
    department: "Institutional Security IT",
    badgeDetail: "Root Admin • Level 4 Clearance",
    isRootDept: true,
    status: "Active • Root Session",
    statusDotColor: "bg-blue-600",
    authMethod: "YubiKey 5C NFC Enforced",
    authIcon: "yubikey",
  },
  {
    id: "user-6",
    name: "Officer David Chen",
    avatarText: "DC",
    avatarBg: "bg-blue-100 text-blue-800",
    email: "d.chen@campusguard.edu",
    identifier: "#GRD-3910",
    role: "Security Guard",
    rolePillBg: "bg-blue-100 text-blue-800",
    department: "Campus Security Division",
    badgeDetail: "South Quad Patrol • Shield #3910",
    status: "Active • Off Duty",
    statusDotColor: "bg-slate-400",
    authMethod: "2FA Enrolled",
    authIcon: "shield",
  },
];

export default function AdminUsersView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles (5 Tiers)");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const allSelected = selectedIds.length === DIRECTORY_USERS.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(DIRECTORY_USERS.map((u) => u.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-5">
      {/* Notice Banner */}
      {actionNotice && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <span>{actionNotice}</span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-blue-700 hover:text-blue-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP HEADER & ACTION BUTTONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-rose-700 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span>CAMPUSGUARD INSTITUTIONAL GOVERNANCE</span>
            <span className="text-slate-300">•</span>
            <span>ROOT ACCESS</span>
            <span className="text-slate-300">•</span>
            <span>ACCESS CONTROL</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Institutional Users &amp; Role Clearance Directory
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl mt-0.5 leading-relaxed">
            Provision system credentials, assign tiered role clearances, enforce MFA policies, and inspect active session tokens across all collegiate divisions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => handleAction("Exporting comprehensive user roster (CSV / JSON)...")}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export User Roster</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction("Opening user provisioning wizard...")}
            className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Provision New User</span>
          </button>
        </div>
      </div>

      {/* 3 KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: TOTAL USER ACCOUNTS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total User Accounts
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 leading-none">1,284</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
              +12 this week
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-blue-700 h-full rounded-full" style={{ width: "70%" }}></div>
          </div>
        </div>

        {/* Card 2: ROLE DISTRIBUTION */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Role Distribution
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 leading-none">5</span>
            <span className="text-xs font-semibold text-slate-600">Active Tiers</span>
          </div>
          {/* Segmented Bar */}
          <div className="w-full flex h-1.5 rounded-full overflow-hidden mt-3 gap-0.5">
            <div className="bg-blue-600 h-full" style={{ width: "45%" }} title="Students"></div>
            <div className="bg-purple-600 h-full" style={{ width: "15%" }} title="Proctors"></div>
            <div className="bg-indigo-600 h-full" style={{ width: "20%" }} title="Guards"></div>
            <div className="bg-amber-500 h-full" style={{ width: "12%" }} title="Supervisors"></div>
            <div className="bg-rose-600 h-full" style={{ width: "8%" }} title="Admins"></div>
          </div>
        </div>

        {/* Card 3: ACTIVE SESSIONS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Sessions
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 leading-none">312</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
              Live Telemetry
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-blue-700 h-full rounded-full" style={{ width: "85%" }}></div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, email, department, badge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
          >
            <option>All Roles (5 Tiers)</option>
            <option>Student</option>
            <option>Proctor and DSW</option>
            <option>Security Guard</option>
            <option>Shift Supervisor</option>
            <option>System Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
          >
            <option>All Statuses</option>
            <option>Active</option>
            <option>Off Duty</option>
            <option>Suspended</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
          >
            <option>All Departments</option>
            <option>Computer Science &amp; Eng.</option>
            <option>Dean of Student Welfare</option>
            <option>Campus Security Division</option>
            <option>Operations Dispatch Control</option>
            <option>Institutional Security IT</option>
          </select>

          <button
            type="button"
            onClick={() => handleAction("Advanced filters modal opened.")}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>More</span>
          </button>
        </div>

        {/* Bulk Action Subbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="rounded border-slate-300 text-blue-700 focus:ring-blue-600 w-4 h-4 cursor-pointer"
            />
            <span className="font-bold uppercase text-[10px] tracking-wider text-slate-600">
              SELECT ALL ON PAGE (6)
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-normal">
              Directory indexed: <strong className="text-slate-800">1,284</strong> total credentials
            </span>
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleAction("Batch password reset emails queued for selected users.")}
              className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Batch Password Reset</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction("Deactivation confirmed for selected credentials.")}
              className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Deactivate Selected</span>
            </button>
          </div>
        </div>
      </div>

      {/* DIRECTORY TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-700 focus:ring-blue-600 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">USER &amp; CREDENTIALS</th>
                <th className="py-3 px-4">INSTITUTIONAL ROLE</th>
                <th className="py-3 px-4">DEPARTMENT &amp; BADGE</th>
                <th className="py-3 px-4">STATUS &amp; 2FA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {DIRECTORY_USERS.map((user) => {
                const isChecked = selectedIds.includes(user.id);
                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-slate-50/70 transition ${
                      isChecked ? "bg-blue-50/30" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 align-middle">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(user.id)}
                        className="rounded border-slate-300 text-blue-700 focus:ring-blue-600 w-4 h-4 cursor-pointer"
                      />
                    </td>

                    {/* User & Credentials */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${user.avatarBg}`}
                        >
                          {user.avatarText}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-sm">
                              {user.name}
                            </span>
                            {user.isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700 uppercase">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {user.email} <span className="text-slate-300">•</span> {user.identifier}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Institutional Role */}
                    <td className="py-3.5 px-4 align-middle">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold ${user.rolePillBg}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Department & Badge */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="font-bold text-slate-900">
                        {user.department}
                      </div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          user.isRootDept ? "text-rose-600 font-semibold" : "text-slate-500"
                        }`}
                      >
                        {user.badgeDetail}
                      </div>
                    </td>

                    {/* Status & 2FA */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <span className={`w-2 h-2 rounded-full ${user.statusDotColor}`}></span>
                        <span>{user.status}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        {user.authIcon === "app" && <Smartphone className="w-3 h-3 text-slate-400" />}
                        {user.authIcon === "fido" && <Key className="w-3 h-3 text-slate-400" />}
                        {user.authIcon === "bio" && <Fingerprint className="w-3 h-3 text-slate-400" />}
                        {user.authIcon === "push" && <ShieldCheck className="w-3 h-3 text-slate-400" />}
                        {user.authIcon === "yubikey" && <Key className="w-3 h-3 text-slate-400" />}
                        {user.authIcon === "shield" && <CheckCircle2 className="w-3 h-3 text-slate-400" />}
                        <span>{user.authMethod}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>Showing 1 – 6 of 1,284 registered accounts</div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded border border-slate-200 text-slate-300 cursor-not-allowed font-semibold"
            >
              Previous
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded bg-[#0a2f77] text-white font-bold flex items-center justify-center shadow-xs"
            >
              1
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold flex items-center justify-center cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold flex items-center justify-center cursor-pointer"
            >
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button
              type="button"
              className="px-2 h-7 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold flex items-center justify-center cursor-pointer"
            >
              214
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
            >
              Next &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
