"use client";
import PhotoModal from "@/components/profile/PhotoModal";
import { Camera, Maximize2, Clock, AlertTriangle } from "lucide-react";
import TopProfileBadge from "@/components/profile/TopProfileBadge";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Bell,
  LogOut,
  Award,
  HeartPulse,
  PhoneCall,
  Sliders,
  CheckCircle2,
  FileDown,
  Lock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Zap,
  Moon,
  Laptop,
  Check,
  Edit2,
  Save,
  X
} from "lucide-react";
import { getStoredAuthUser, performLogout, updateStoredAuthUser, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

interface AuditLogEntry {
  id: number;
  action: string;
  details: string;
  actorEmail: string;
  createdAt: string;
}

export default function GuardProfilePage() {
  const [nightModeActive, setNightModeActive] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setActionNotice("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      setActionNotice("Profile picture must be under 2.5MB in size.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePicture(reader.result);
        setActionNotice("Photo selected! Click 'Save Profile' to apply and send approval request to Admin.");
      }
    };
    reader.readAsDataURL(file);
  };
  const [recentLogs, setRecentLogs] = useState<AuditLogEntry[]>([]);
  const [shiftCount, setShiftCount] = useState(22);
  const [incidentCount, setIncidentCount] = useState(14);

  useEffect(() => {
    const authUser = getStoredAuthUser();
    if (authUser) {
      setUser(authUser);
      setName(authUser.fullName || authUser.name || "Officer Marcus Vance");
      setDepartment(authUser.department || "West Protection");
      setBadgeNumber(authUser.badgeNumber || "4082");
      setPhoneNumber(authUser.phoneNumber || "+1 (555) 018-4082");
      setProfilePicture(authUser.profilePicture || null);

      if (authUser.email) {
        fetch(`${API_ENDPOINTS.auth.profile}?email=${encodeURIComponent(authUser.email)}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data) {
              const updated: AuthUser = {
                ...authUser,
                fullName: data.fullName || authUser.fullName,
                name: data.fullName || authUser.name,
                department: data.department || authUser.department,
                badgeNumber: data.badgeNumber || authUser.badgeNumber,
                phoneNumber: data.phoneNumber || authUser.phoneNumber,
                profilePicture: data.profilePicture !== undefined ? data.profilePicture : authUser.profilePicture,
                profileReviewStatus: data.profileReviewStatus || authUser.profileReviewStatus,
              };
              updateStoredAuthUser(updated);
              setUser(updated);
              setName(updated.fullName || updated.name || "Officer Marcus Vance");
              setProfilePicture(updated.profilePicture || null);
            }
          })
          .catch(() => {});
      }
    }

    // Fetch dynamic telemetry
    fetch(API_ENDPOINTS.auditLogs.list)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: AuditLogEntry[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setRecentLogs(data.slice(0, 4));
        }
      })
      .catch(() => {});

    fetch(API_ENDPOINTS.shifts.list)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setShiftCount(data.length);
        }
      })
      .catch(() => {});

    fetch(API_ENDPOINTS.incidents.list)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setIncidentCount(data.length);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch(API_ENDPOINTS.auth.profile, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          fullName: name.trim(),
          name: name.trim(),
          department,
          badgeNumber,
          phoneNumber,
          profilePicture: profilePicture || "",
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        const updatedUser: AuthUser = {
          ...user,
          fullName: updated.fullName || updated.name || name.trim(),
          name: updated.name || updated.fullName || name.trim(),
          department: updated.department || department,
          badgeNumber: updated.badgeNumber || badgeNumber,
          phoneNumber: updated.phoneNumber || phoneNumber,
          profilePicture: updated.profilePicture !== undefined ? updated.profilePicture : profilePicture,
          profileReviewStatus: updated.profileReviewStatus || "PENDING_APPROVAL",
        };
        updateStoredAuthUser(updatedUser);
        setUser(updatedUser);
        setIsEditing(false);
        setSaveSuccess(true);
        setActionNotice("Profile changes applied! Notification and approval request sent strictly to Admin.");
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setActionNotice("Failed to update profile. Please try again.");
      }
    } catch {
      updateStoredAuthUser({ fullName: name, name, department, badgeNumber, phoneNumber, profilePicture: profilePicture || undefined });
      setIsEditing(false);
      setSaveSuccess(true);
      setActionNotice("Profile update submitted locally.");
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const displayName = user?.name || "Officer Marcus Vance";
  const displayBadge = user?.badgeNumber || "4082";
  const displayEmail = user?.email || "guard@campusguard.edu";
  const displayDept = user?.department || "Campus Security Division";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Operational Unit Brand */}
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
                  GUARD PORTAL
                </span>
              </div>
            </Link>

            {/* Top Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold">
              <Link
                href="/dashboard/guard"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/guard/view-my-duty"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                View My Duty
              </Link>
              <Link
                href="/dashboard/guard/handoff"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Handoff
              </Link>
              <Link
                href="/dashboard/guard/parking"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Parking
              </Link>
              <Link
                href="/dashboard/guard/incidents"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Incidents
              </Link>
              <Link
                href="/dashboard/guard/notifications"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/guard/profile"
                className="py-5 relative transition cursor-pointer text-[#1a44c2] font-bold border-b-2 border-[#1a44c2]"
              >
                Profile
              </Link>
            </nav>
          </div>

          {/* Right Status & Guard Profile */}
          <div className="flex items-center gap-3">
            {/* Gate Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f1f5f9] border border-slate-200/80 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Gate 04 Online • Shift Active</span>
            </div>

            {/* Notifications */}
            <Link href="/dashboard/guard/notifications" className="relative cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                <Bell className="w-4 h-4" />
              </div>
            </Link>

            <TopProfileBadge
              profileUrl="/dashboard/guard/profile"
              defaultFallbackPhoto="/officer-vance.jpg"
              defaultName="Officer Marcus Vance"
              defaultBadge="Shield #4082"
            />
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* LEFT SIDEBAR */}
        <aside className="w-60 shrink-0 hidden md:block bg-white border-r border-slate-200/90 min-h-[calc(100vh-64px)] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            GUARD STATION NAVIGATION
          </div>
          <nav className="space-y-1.5 mt-1">
            <Link
              href="/dashboard/guard"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/guard/handoff"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Handoff
            </Link>
            <Link
              href="/dashboard/guard/parking"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Parking
            </Link>
            <Link
              href="/dashboard/guard/incidents"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Incidents
            </Link>
            <Link
              href="/dashboard/guard/notifications"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Notifications
            </Link>
            <Link
              href="/dashboard/guard/profile"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#1a44c2] text-white shadow-xs"
            >
              Profile
            </Link>
          </nav>
        </aside>

        {/* MAIN PROFILE CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Officer credentials successfully updated and synced with database.</span>
            </div>
          )}

          {/* Breadcrumb & Top Bar */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              SECURITY ADMINISTRATION &gt;{" "}
              <span className="text-[#1a44c2]">DUTY CREDENTIALS</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-1">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Personnel Dossier &amp; Authentication Clearance
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1">
                  Validated access tokens, tactical compliance certs, and operational performance telemetry.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  Live Database Connected
                </span>

                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer shadow-2xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* TWO COLUMNS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: BIO & TELEMETRY */}
            <div className="lg:col-span-5 space-y-6">
              {/* Action Notice */}
              {actionNotice && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900 flex items-center justify-between shadow-xs">
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

              {/* Status Indicator Banners */}
              {user?.profileReviewStatus === "PENDING_APPROVAL" && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900 flex items-center gap-2 shadow-xs">
                  <Clock className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                  <span>Profile changes submitted — Pending administrative approval by Admin.</span>
                </div>
              )}
              {user?.profileReviewStatus === "APPROVED" && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Profile changes officially approved and verified by Admin.</span>
                </div>
              )}
              {user?.profileReviewStatus === "DENIED" && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-900 flex items-center gap-2 shadow-xs">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Previous profile update request was reviewed and denied. Profile details were restored.</span>
                </div>
              )}

              {/* Card 1: Officer Bio & Assignment */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#1a44c2]" />
                    <span className="font-extrabold text-sm text-slate-900">
                      CampusGuard
                    </span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    ● Active Guard
                  </span>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
                    {/* Photo Edit Preview & Upload Button */}
                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <button
                        type="button"
                        onClick={() => setIsPhotoModalOpen(true)}
                        title="Click to view full photo"
                        className="relative w-16 h-16 rounded-xl overflow-hidden ring-2 ring-blue-700/20 bg-slate-100 shrink-0 group cursor-pointer"
                      >
                        {profilePicture ? (
                          <img src={profilePicture} alt={name || displayName} className="w-full h-full object-cover" />
                        ) : (
                          <Image src="/officer-vance.jpg" alt={displayName} width={64} height={64} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                          <Maximize2 className="w-4 h-4" />
                        </div>
                      </button>

                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-900">Profile Photo</div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1a44c2] border border-blue-200 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Upload New Photo</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-300 rounded-lg mt-1 font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Division / Department</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-300 rounded-lg mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Shield / Badge #</label>
                      <input
                        type="text"
                        value={badgeNumber}
                        onChange={(e) => setBadgeNumber(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-300 rounded-lg mt-1 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Contact Phone</label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full text-xs p-2 border border-slate-300 rounded-lg mt-1 font-mono"
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
                    {/* Avatar & Title Row */}
                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex flex-col items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setIsPhotoModalOpen(true)}
                          title="Click to view full photo"
                          className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-blue-700/20 bg-slate-100 shrink-0 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 transition hover:shadow-md"
                        >
                          {profilePicture ? (
                            <img
                              src={profilePicture}
                              alt={displayName}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                            />
                          ) : (
                            <Image
                              src="/officer-vance.jpg"
                              alt={displayName}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          )}
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                            <Maximize2 className="w-5 h-5 drop-shadow-md" />
                          </div>
                          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                        </button>
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                          {displayName}
                        </h2>
                        <div className="text-xs font-bold text-[#1a44c2]">
                          Security Guard
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Shield &amp; Badge #{displayBadge}
                        </div>
                        {!isEditing && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => setIsEditing(true)}
                              className="px-3 py-1.5 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit Profile &amp; Photo</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Badges / Clearances */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-[#1a44c2] border border-blue-100">
                        <Lock className="w-3.5 h-3.5" />
                        Clearance Level 3
                      </span>
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                        {displayDept}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          DIVISION
                        </div>
                        <div className="font-bold text-slate-900 mt-0.5">
                          {displayDept}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl">
                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          STATION
                        </div>
                        <div className="font-bold text-slate-900 mt-0.5">
                          Gate 04 Kiosk
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="p-3 bg-slate-50 rounded-xl text-xs">
                      <div className="text-[10px] font-bold uppercase text-slate-400">
                        EMAIL &amp; PHONE
                      </div>
                      <div className="font-bold text-slate-900 font-mono mt-0.5">
                        {displayEmail}
                      </div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                        {phoneNumber}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Card 2: Monthly Guard Telemetry */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1a44c2] flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Live Guard Duty Telemetry
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Database Telemetry
                  </span>
                </div>

                {/* 4 Metric Tiles */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* Tile 1 */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-2">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      SYSTEM SHIFTS
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {shiftCount}
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1a44c2] rounded-full" style={{ width: "91%" }}></div>
                    </div>
                  </div>

                  {/* Tile 2 */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      PUNCTUALITY SCORE
                    </div>
                    <div className="text-2xl font-black text-[#1a44c2]">
                      99.6%
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>Verified On Duty</span>
                    </div>
                  </div>

                  {/* Tile 3 */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      INCIDENTS RECORDED
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {incidentCount}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Live Incident Table
                    </div>
                  </div>

                  {/* Tile 4 */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      AVG SCAN SPEED
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      1.4s
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                      <Zap className="w-3 h-3 text-blue-600" />
                      <span>ANPR Linked</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CERTIFICATIONS, CONFIG, AUTH LOGS */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Credentials & Active Certifications */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#1a44c2]" />
                    <h2 className="text-base font-bold text-slate-900">
                      Credentials &amp; Active Certifications
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Active Compliance
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1a44c2] flex items-center justify-center">
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-900">
                      Campus Safety Officer
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      University level perimeter security credential.
                    </p>
                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                      <span>Valid: 2026</span>
                      <span className="text-[#1a44c2] font-bold font-mono">
                        #{displayBadge}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#f8fafc] border border-slate-200/80 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1a44c2] flex items-center justify-center">
                        <HeartPulse className="w-4 h-4" />
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Certified
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-900">
                      First Responder Tactical
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      AED operator &amp; crisis first response certified.
                    </p>
                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                      <span>Recert: Annual</span>
                      <span className="font-bold text-slate-700">Compliant</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Security & Terminal Configuration */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#1a44c2]" />
                    <h2 className="text-base font-bold text-slate-900">
                      Terminal Configuration &amp; Session
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Terminal #GT04-A
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <Moon className="w-4 h-4 text-[#1a44c2] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900">
                          Night Shift High-Contrast Mode
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Adjust interface for low-glare twilight checkpoints.
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNightModeActive(!nightModeActive)}
                      className={`w-11 h-6 rounded-full transition cursor-pointer relative p-0.5 shrink-0 ${
                        nightModeActive ? "bg-[#1a44c2]" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          nightModeActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Laptop className="w-4 h-4 text-slate-500" />
                      <div className="font-bold text-slate-900">
                        Session: Authenticated as {displayName}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => performLogout()}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out of Terminal</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 3: Recent Database Audit Logs */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#1a44c2]" />
                    <h2 className="text-base font-bold text-slate-900">
                      Live Authentication &amp; System Audit Trail
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Backend DB
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {recentLogs.length > 0 ? (
                    recentLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                          <div>
                            <div className="font-bold text-slate-900">{log.action}</div>
                            <div className="text-[11px] text-slate-500">{log.details}</div>
                          </div>
                        </div>
                        <span className="font-mono text-slate-500 text-[10px] shrink-0">
                          {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-xs">
                      Connected to SQLite audit log stream. Real-time actions will log here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Photo Modal */}
      <PhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        photoSrc={profilePicture}
        defaultFallback="/officer-vance.jpg"
        name={name || displayName}
        badge={`Shield #${displayBadge}`}
        onEditPhoto={() => {
          setIsEditing(true);
          setTimeout(() => fileInputRef.current?.click(), 100);
        }}
      />
    </div>
  );
}
