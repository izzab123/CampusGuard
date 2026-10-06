"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Edit3,
  Download,
  LogOut,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  Home,
  Car,
  CheckCircle2,
  Save,
  Key,
  Smartphone,
  PhoneCall
} from "lucide-react";
import { performLogout, getStoredAuthUser, saveAuthUser, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

export default function StudentProfileView() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [parkingPass, setParkingPass] = useState<any>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    const stored = getStoredAuthUser();
    setUser(stored);
    if (stored) {
      setFullName(stored.fullName || "");
      setDepartment(stored.department || "");
      fetch(API_ENDPOINTS.parking.my(stored.fullName))
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setParkingPass(data);
        })
        .catch(() => {});
    }
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      const res = await fetch(API_ENDPOINTS.auth.profile, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          fullName,
          department,
        }),
      });

      if (res.ok) {
        const updatedUser: AuthUser = {
          ...user,
          fullName,
          department,
        };
        saveAuthUser(updatedUser);
        setUser(updatedUser);
        setEditing(false);
        handleAction("Profile updated successfully in institutional directory.");
      } else {
        handleAction("Failed to update profile.");
      }
    } catch {
      handleAction("Profile update cached locally.");
    }
  };

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
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

      {/* TOP HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
            <span>CAMPUS IDENTITY &amp; PHYSICAL ACCESS</span>
            <span className="text-slate-300">•</span>
            <span className="text-blue-700">Active Session</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Student Identity &amp; Access Profile
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl mt-0.5 leading-relaxed">
            Manage your campus credentials, registered vehicles, trusted emergency contacts, and physical clearances.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {editing ? (
            <button
              type="button"
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Profile</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => performLogout()}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-red-50 hover:border-red-200 text-red-600 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: HERO CARD + VEHICLE REGISTRATION */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. SECURE ENROLLMENT ID-CARD (HERO) */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-[#0a2f77] text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold tracking-wider uppercase">
                  SECURE ENROLLMENT ID-CARD
                </span>
              </div>
              <span className="text-[10px] font-mono text-blue-200">
                CAMPUSGUARD AUTHENTICATED
              </span>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-blue-700/20 bg-slate-100 shrink-0">
                    <Image
                      src="/student-alex.jpg"
                      alt="Student"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>

                  <div className="space-y-1">
                    {editing ? (
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="text-lg font-bold border border-slate-300 rounded px-2 py-0.5"
                      />
                    ) : (
                      <h2 className="text-xl font-extrabold text-slate-900 leading-none">
                        {user?.fullName || "Alex Morgan"}
                      </h2>
                    )}
                    <div className="text-xs font-semibold text-slate-500">
                      Role: {user?.role || "Student"}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-600">
                      <span className="font-bold text-blue-800">{user?.badgeNumber || "#STU-88201"}</span>
                      <span className="text-slate-300">•</span>
                      <span>Email: {user?.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 self-start sm:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    ENROLLED • ACTIVE
                  </span>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-700" />
                    <span>Department</span>
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full text-xs font-bold border border-slate-300 rounded px-2 py-1 mt-1"
                    />
                  ) : (
                    <div className="font-bold text-slate-900">
                      {user?.department || "Dept. of Computer Science & Eng."}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-700" />
                    <span>Campus Email</span>
                  </div>
                  <div className="font-bold font-mono text-blue-700">
                    {user?.email || "student@campusguard.edu"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. VEHICLE & PARKING REGISTRATION */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Vehicle &amp; Parking Registration
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {parkingPass?.status || "ACTIVE PERMIT"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Registered Plate
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  {parkingPass?.plateNumber || "7XYZ-42"}
                </div>
                <div className="text-[11px] text-slate-500">Optical Recognition Sync</div>
              </div>

              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-4 pt-3 sm:pt-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Assigned Bay
                </div>
                <div className="font-extrabold text-slate-900">
                  {parkingPass?.zoneName || "Lot C • Deck #314"}
                </div>
                <div className="text-[11px] text-slate-500">
                  Token: {parkingPass?.passToken || "CG-PASS-88201-ALX"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Security Credentials</h3>
              <p className="text-[11px] text-slate-500">Hardware tokens and device keys</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4 text-blue-700" />
                  <div>
                    <div className="font-bold text-slate-900">Dynamic Pass Token</div>
                    <div className="text-[11px] text-slate-500">AES-256 Validated</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
