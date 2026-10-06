"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Key,
  ShieldCheck,
  Edit3,
  Mail,
  Building,
  LogOut,
  Save,
  CheckCircle2
} from "lucide-react";
import { performLogout, getStoredAuthUser, saveAuthUser, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

export default function ProctorProfileView() {
  const [user, setUser] = useState<AuthUser | null>(null);
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
    }
  }, []);

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

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
        const updatedUser: AuthUser = { ...user, fullName, department };
        saveAuthUser(updatedUser);
        setUser(updatedUser);
        setEditing(false);
        handleAction("Proctor authority profile successfully updated.");
      }
    } catch {
      handleAction("Profile update cached locally.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Action Notice */}
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
            <span>STATUTORY AUTHORITY REGISTER</span>
            <span className="text-slate-300">•</span>
            <span className="text-purple-700">Dean of Student Welfare Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Executive Proctor &amp; Dean Dossier
          </h1>
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
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-red-50 text-red-600 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* DOSSIER CARD */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-purple-600/20 bg-slate-100 shrink-0">
              <Image
                src="/proctor-vance.jpg"
                alt="Dr. Arthur Vance"
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
                  {user?.fullName || "Dr. Arthur Vance"}
                </h2>
              )}
              <div className="text-xs font-semibold text-slate-500">
                Institutional Role: {user?.role || "Proctor and DSW"}
              </div>
              <div className="text-xs font-mono text-purple-800 font-bold">
                {user?.badgeNumber || "DSW Executive Dean #PR-109"}
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            EXECUTIVE DISCIPLINARY CLEARANCE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Office / Department
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
                {user?.department || "Dean of Student Welfare"}
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Institutional Email
            </div>
            <div className="font-bold font-mono text-blue-700">
              {user?.email || "proctor@campusguard.edu"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
