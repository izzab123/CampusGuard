"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Bell,
  LogOut,
  Edit2,
  FileDown,
  Shield,
  Lock,
  Building,
  Mail,
  UserCheck,
  PhoneCall,
  Save,
  CheckCircle2
} from "lucide-react";
import { getStoredAuthUser, performLogout, updateStoredAuthUser, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

export default function SupervisorProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shiftsCount, setShiftsCount] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const authUser = getStoredAuthUser();
    if (authUser) {
      setUser(authUser);
      setName(authUser.name || "Supervisor Elena Rostova");
      setDepartment(authUser.department || "Operations Dispatch Control");
      setBadgeNumber(authUser.badgeNumber || "SS-104");
      setPhoneNumber(authUser.phoneNumber || "+1 (555) 018-9104");
    }

    fetch(API_ENDPOINTS.shifts.list)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setShiftsCount(data.length);
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch(API_ENDPOINTS.auth.profile, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name,
          department,
          badgeNumber,
          phoneNumber,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        updateStoredAuthUser({
          name: updated.name || name,
          department: updated.department || department,
          badgeNumber: updated.badgeNumber || badgeNumber,
          phoneNumber: updated.phoneNumber || phoneNumber,
        });
        setUser((prev) =>
          prev
            ? {
                ...prev,
                name: updated.name || name,
                department: updated.department || department,
                badgeNumber: updated.badgeNumber || badgeNumber,
                phoneNumber: updated.phoneNumber || phoneNumber,
              }
            : null
        );
        setIsEditing(false);
        setNotice("Supervisor profile saved and synced to database.");
        setTimeout(() => setNotice(null), 3000);
      }
    } catch {
      updateStoredAuthUser({ name, department, badgeNumber, phoneNumber });
      setIsEditing(false);
      setNotice("Profile updated.");
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const displayName = user?.name || "Supervisor Elena Rostova";
  const displayBadge = user?.badgeNumber || "SS-104";
  const displayEmail = user?.email || "supervisor@campusguard.edu";
  const displayDept = user?.department || "Operations Dispatch Control";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a44c2] flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                  CampusGuard
                </span>
                <span className="text-[11px] font-extrabold tracking-wider text-slate-700 uppercase leading-none">
                  SUPERVISOR PORTAL
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold">
              <Link
                href="/dashboard/supervisor"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/supervisor/shifts"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Shifts
              </Link>
              <Link
                href="/dashboard/supervisor/escalations"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Escalations
              </Link>
              <Link
                href="/dashboard/supervisor/logbook"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Logbook
              </Link>
              <Link
                href="/dashboard/supervisor/notifications"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/supervisor/profile"
                className="py-5 relative transition cursor-pointer text-[#1a44c2] font-bold border-b-2 border-[#1a44c2]"
              >
                Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f1f5f9] border border-slate-200/80 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ACTIVE WATCH COMMAND</span>
            </div>

            <Link href="/dashboard/supervisor/notifications" className="relative cursor-pointer">
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

      {/* 2. BODY LAYOUT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between bg-white border-r border-slate-200/90 min-h-[calc(100vh-64px)] p-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              SUPERVISOR CONSOLE
            </div>
            <nav className="space-y-1.5 mt-1">
              <Link
                href="/dashboard/supervisor"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/supervisor/shifts"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Shifts
              </Link>
              <Link
                href="/dashboard/supervisor/escalations"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Escalations
              </Link>
              <Link
                href="/dashboard/supervisor/logbook"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Logbook
              </Link>
              <Link
                href="/dashboard/supervisor/notifications"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/supervisor/profile"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#1a44c2] text-white shadow-xs"
              >
                Profile
              </Link>
            </nav>
          </div>
        </aside>

        {/* MAIN PROFILE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {notice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{notice}</span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Shift Supervisor Dossier &amp; Watch Authority
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1">
                Validated supervisor credentials, operational sector authorizations, and dispatch telemetry.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? "Cancel" : "Edit Supervisor Profile"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#1a44c2]" />
                    <span className="font-extrabold text-sm text-slate-900">CampusGuard Watch</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    ● Executive Supervisor
                  </span>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-3 pt-2 text-xs">
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Supervisor Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Department</label>
                      <input
                        type="text"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Badge ID</label>
                      <input
                        type="text"
                        required
                        value={badgeNumber}
                        onChange={(e) => setBadgeNumber(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Direct Phone</label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-4 pt-1">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-200 shrink-0">
                        <Image
                          src="/supervisor-elena.jpg"
                          alt={displayName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                          {displayName}
                        </h2>
                        <div className="text-xs font-bold text-[#1a44c2]">
                          Shift Supervisor &amp; Watch Commander
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Badge #{displayBadge}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <div className="text-[10px] font-bold uppercase text-slate-400">COMMAND UNIT</div>
                        <div className="font-bold text-slate-900 mt-0.5">{displayDept}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <div className="text-[10px] font-bold uppercase text-slate-400">AUTHORIZATION</div>
                        <div className="font-bold text-slate-900 mt-0.5">Clearance Level 4</div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs">
                      <div className="text-[10px] font-bold uppercase text-slate-400">CONTACT ROUTING</div>
                      <div className="font-bold text-slate-900 font-mono mt-0.5">{displayEmail}</div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">{phoneNumber}</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <h2 className="text-base font-bold text-slate-900">
                  Supervisor Operational Summary
                </h2>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500">ASSIGNED SHIFTS MANAGED</span>
                    <div className="text-2xl font-black text-slate-900">{shiftsCount}</div>
                    <span className="text-slate-500 text-[11px]">Active in database</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500">SECTOR COVERAGE</span>
                    <div className="text-2xl font-black text-[#1a44c2]">100%</div>
                    <span className="text-slate-500 text-[11px]">All perimeter sectors</span>
                  </div>
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                  <span className="text-xs text-slate-500">Session authenticated</span>
                  <button
                    type="button"
                    onClick={() => performLogout()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out of Watch Command</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
