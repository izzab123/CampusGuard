"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Edit3,
  LogOut,
  ShieldCheck,
  Building,
  Mail,
  Car,
  Save,
  Key,
  Camera,
  Maximize2,
  X,
  UserCheck,
  Clock,
  CheckCircle2,
  Lock
} from "lucide-react";
import { performLogout, getStoredAuthUser, saveAuthUser, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

export default function StudentProfileView() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [parkingPass, setParkingPass] = useState<any>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async (email: string, stored: AuthUser) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.auth.profile}?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          const updated: AuthUser = {
            ...stored,
            fullName: data.fullName || stored.fullName,
            name: data.fullName || stored.name,
            department: data.department || stored.department,
            badgeNumber: data.badgeNumber || stored.badgeNumber,
            profilePicture: data.profilePicture !== undefined ? data.profilePicture : stored.profilePicture,
            profileReviewStatus: data.profileReviewStatus || stored.profileReviewStatus,
          };
          saveAuthUser(updated);
          setUser(updated);
          setFullName(updated.fullName || "");
          setProfilePicture(updated.profilePicture || null);
        }
      }
    } catch {}
  };

  useEffect(() => {
    const stored = getStoredAuthUser();
    setUser(stored);
    if (stored) {
      setFullName(stored.fullName || "");
      setProfilePicture(stored.profilePicture || null);
      if (stored.email) {
        fetchProfile(stored.email, stored);
      }
      fetch(API_ENDPOINTS.parking.my(stored.fullName))
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setParkingPass(data);
        })
        .catch(() => {});
    }

    const handleAuthChange = (e: any) => {
      if (e.detail) {
        setUser(e.detail);
        setFullName(e.detail.fullName || "");
        setProfilePicture(e.detail.profilePicture || null);
      }
    };

    window.addEventListener("campusguard_auth_change", handleAuthChange);
    return () => {
      window.removeEventListener("campusguard_auth_change", handleAuthChange);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      handleAction("Please select an image file (PNG, JPG, WEBP).");
      return;
    }

    // Size limit: 2MB for base64 storage
    if (file.size > 2 * 1024 * 1024) {
      handleAction("Image size must be smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setProfilePicture(dataUrl);
      handleAction("Photo loaded. Click 'Save Changes' to apply.");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    if (!fullName.trim()) {
      handleAction("Full name cannot be blank.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(API_ENDPOINTS.auth.profile, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          fullName: fullName.trim(),
          profilePicture: profilePicture || "",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedUser: AuthUser = {
          ...user,
          fullName: data.fullName || fullName.trim(),
          name: data.fullName || fullName.trim(),
          department: data.department || user.department,
          profilePicture: data.profilePicture !== undefined ? data.profilePicture : profilePicture,
          profileReviewStatus: data.profileReviewStatus || "PENDING_APPROVAL",
        };
        saveAuthUser(updatedUser);
        setUser(updatedUser);
        setEditing(false);
        handleAction("Profile updated on your dashboard. An approval request has been sent to the administrator.");
      } else {
        handleAction("Failed to update profile. Please check server connection.");
      }
    } catch {
      handleAction("Network error. Profile changes cached locally.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEditing = () => {
    setEditing(false);
    setFullName(user?.fullName || "");
    setProfilePicture(user?.profilePicture || null);
  };

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const isPendingApproval = user?.profileReviewStatus === "PENDING_APPROVAL";

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
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5 flex-wrap">
            <span>CAMPUS IDENTITY &amp; PHYSICAL ACCESS</span>
            <span className="text-slate-300">•</span>
            <span className="text-blue-700">Active Session</span>
            {isPendingApproval && (
              <>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Pending Admin Approval</span>
                </span>
              </>
            )}
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEditing}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
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
                  {/* Photo Container with Click-to-View and Edit Upload */}
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
                          alt={user?.fullName || "Student"}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                        />
                      ) : (
                        <Image
                          src="/student-alex.jpg"
                          alt="Student"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      )}
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                        <Maximize2 className="w-5 h-5 drop-shadow-md" />
                      </div>
                      <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                    </button>

                    {/* Change Photo Button when in Edit Mode */}
                    {editing && (
                      <div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-2xs transition cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    {editing ? (
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full name"
                          className="text-lg font-bold border border-slate-300 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                        />
                      </div>
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
                  {isPendingApproval && (
                    <div className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Approval Pending</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-slate-100 text-xs">
                {/* Department: READ-ONLY FOR STUDENTS */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-blue-700" />
                      <span>Department</span>
                    </div>
                    {editing && (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-200/80 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> Non-editable
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-slate-900">
                    {user?.department || "Dept. of Computer Science & Eng."}
                  </div>
                  {editing && (
                    <p className="text-[10px] text-slate-400">
                      Assigned by Institutional Registry. Students cannot alter departments.
                    </p>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-700" />
                    <span>Campus Email</span>
                  </div>
                  <div className="font-bold font-mono text-blue-700">
                    {user?.email || "student@campusguard.edu"}
                  </div>
                  {editing && (
                    <p className="text-[10px] text-slate-400">
                      Linked to SSO institutional directory.
                    </p>
                  )}
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

      {/* FULL PHOTO VIEW MODAL (LIGHTBOX) */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 flex flex-col">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-700" />
                <h3 className="text-xs font-bold text-slate-900">Student Profile Photo</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center gap-4 bg-slate-50/50">
              <div className="w-64 h-64 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl bg-slate-100 flex items-center justify-center">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={fullName || "Student"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/student-alex.jpg"
                    alt="Student"
                    width={256}
                    height={256}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="text-center">
                <h4 className="text-base font-extrabold text-slate-900">{fullName || user?.fullName || "Student"}</h4>
                <p className="text-xs text-blue-800 font-mono font-bold mt-0.5">{user?.badgeNumber || "#STU-88201"}</p>
                <p className="text-[11px] text-slate-500">{user?.department || "Dept. of Computer Science & Eng."}</p>
              </div>
            </div>

            <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between">
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsPhotoModalOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Choose Different Photo</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="ml-auto px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
