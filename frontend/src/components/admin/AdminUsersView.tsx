"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  Activity,
  Download,
  UserPlus,
  Search,
  RotateCcw,
  Ban,
  ShieldCheck,
  CheckCircle2,
  X,
  Lock,
  Mail,
  UserCheck
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

interface UserAccount {
  id: number;
  email: string;
  name: string;
  role: string;
  department: string;
  badgeNumber: string;
  enabled?: boolean;
  phoneNumber?: string;
}

export default function AdminUsersView() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("Pass@123");
  const [formRole, setFormRole] = useState("Student");
  const [formDepartment, setFormDepartment] = useState("Dept. of Computer Science & Eng.");
  const [formBadgeNumber, setFormBadgeNumber] = useState("");
  const [formPhone, setFormPhone] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.auth.users);
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleToggleStatus = async (user: UserAccount) => {
    const newStatus = user.enabled === false ? true : false;
    try {
      const res = await fetch(API_ENDPOINTS.auth.toggleStatus(user.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newStatus }),
      });

      if (res.ok) {
        showNotice(`Account ${user.email} marked as ${newStatus ? "ACTIVE" : "SUSPENDED"}.`);
        loadUsers();
      }
    } catch {
      showNotice(`Updated account status for ${user.email}.`);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, enabled: newStatus } : u))
      );
    }
  };

  const handleProvisionUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API_ENDPOINTS.auth.users, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          password: formPassword,
          role: formRole,
          department: formDepartment,
          badgeNumber: formBadgeNumber,
          phoneNumber: formPhone,
          enabled: true,
        }),
      });

      if (res.ok) {
        showNotice(`Provisioned account ${formEmail} with role ${formRole}.`);
        setIsProvisionOpen(false);
        setFormName("");
        setFormEmail("");
        setFormBadgeNumber("");
        loadUsers();
      } else {
        const err = await res.json();
        showNotice(`Provisioning notice: ${err.message || "Email may already exist"}`);
      }
    } catch {
      showNotice("Failed to provision account. Check backend connection.");
    }
  };

  const handleExportDirectory = () => {
    if (users.length === 0) return;
    const header = "ID,Name,Email,Role,Department,Badge,Status\n";
    const body = users
      .map(
        (u) =>
          `"${u.id}","${u.name}","${u.email}","${u.role}","${u.department}","${u.badgeNumber}","${u.enabled !== false ? "Active" : "Suspended"}"`
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user_directory_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotice("User directory CSV exported.");
  };

  // Metrics
  const totalCount = users.length;
  const studentCount = users.filter((u) => u.role?.toUpperCase() === "STUDENT").length;
  const staffCount = users.filter((u) =>
    ["SECURITY GUARD", "SHIFT SUPERVISOR", "PROCTOR AND DSW"].includes(u.role?.toUpperCase())
  ).length;
  const adminCount = users.filter((u) => u.role?.toUpperCase() === "ADMIN").length;

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.badgeNumber?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q);

    const matchesRole =
      roleFilter === "All" ||
      u.role?.toLowerCase() === roleFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && u.enabled !== false) ||
      (statusFilter === "Suspended" && u.enabled === false);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {notice && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-blue-700 font-bold ml-2">✕</button>
        </div>
      )}

      {/* HEADER & TOP CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-rose-800 uppercase">
            <span>• INSTITUTIONAL GOVERNANCE • IDENTITY DIRECTORY &amp; RBAC</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            User Accounts &amp; Role-Based Access Control
          </h1>
          <p className="text-xs text-slate-500">
            Real-time identity management, credential provisioning, and session authority across CampusGuard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportDirectory}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Directory CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsProvisionOpen(true)}
            className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Provision New User</span>
          </button>
        </div>
      </div>

      {/* 4 STAT KPI TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Total Registered Users</span>
            <Users className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 leading-none">{totalCount}</div>
          <p className="text-[11px] text-slate-500">Live accounts in database</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Student Accounts</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 leading-none">{studentCount}</div>
          <p className="text-[11px] text-slate-500">Active campus student permits</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Security &amp; Staff</span>
            <Shield className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-700 leading-none">{staffCount}</div>
          <p className="text-[11px] text-slate-500">Guards, supervisors, proctors</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Root Administrators</span>
            <ShieldCheck className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-700 leading-none">{adminCount}</div>
          <p className="text-[11px] text-slate-500">Master institutional governance</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">
            Institutional Identity Directory ({filteredUsers.length} Users Found)
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, email, or badge..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold"
            >
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Proctor and DSW">Proctor and DSW</option>
              <option value="Security Guard">Security Guard</option>
              <option value="Shift Supervisor">Shift Supervisor</option>
              <option value="Admin">Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-3">Identity / User</th>
                <th className="py-3 px-3">Role &amp; Authority</th>
                <th className="py-3 px-3">Department &amp; Badge</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                          {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        user.role === "Admin"
                          ? "bg-rose-100 text-rose-800"
                          : user.role === "Student"
                          ? "bg-blue-100 text-blue-800"
                          : user.role === "Security Guard"
                          ? "bg-indigo-100 text-indigo-800"
                          : user.role === "Proctor and DSW"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-slate-100 text-slate-800"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-semibold">{user.department || "General"}</div>
                      <div className="text-[11px] text-slate-500 font-mono">#{user.badgeNumber || "NA"}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        user.enabled !== false
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.enabled !== false ? "bg-emerald-600" : "bg-red-600"}`}></span>
                        {user.enabled !== false ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                          user.enabled !== false
                            ? "bg-red-50 hover:bg-red-100 text-red-700"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {user.enabled !== false ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No users found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROVISION USER MODAL */}
      {isProvisionOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Provision User Account</h3>
              <button onClick={() => setIsProvisionOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProvisionUser} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Reed"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. user@campusguard.edu"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Role Authority</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  >
                    <option>Student</option>
                    <option>Proctor and DSW</option>
                    <option>Security Guard</option>
                    <option>Shift Supervisor</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Temporary Password</label>
                  <input
                    type="text"
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Badge / Student ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. #STU-9921"
                    value={formBadgeNumber}
                    onChange={(e) => setFormBadgeNumber(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="+1 (555) 018-0000"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsProvisionOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold rounded-lg"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
