"use client";
import PhotoModal from "@/components/profile/PhotoModal";
import { Camera, Maximize2, Clock, AlertTriangle } from "lucide-react";

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
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      handleAction("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      handleAction("Profile photo must be less than 2.5MB in size.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePicture(reader.result);
        handleAction("Photo selected! Click 'Save Changes' to apply and send approval request to Admin.");
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const stored = getStoredAuthUser();
    if (stored) {
      setUser(stored);
      setFullName(stored.fullName || stored.name || "Dr. Arthur Vance");
      setDepartment(stored.department || "Dean of Student Welfare");
      setProfilePicture(stored.profilePicture || null);

      if (stored.email) {
        fetch(`${API_ENDPOINTS.auth.profile}?email=${encodeURIComponent(stored.email)}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
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
              setFullName(updated.fullName || updated.name || "Dr. Arthur Vance");
              setProfilePicture(updated.profilePicture || null);
            }
          })
          .catch(() => {});
      }
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
          fullName: fullName.trim(),
          name: fullName.trim(),
          department,
          profilePicture: profilePicture || "",
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        const updatedUser: AuthUser = {
          ...user,
          fullName: updated.fullName || updated.name || fullName.trim(),
          name: updated.name || updated.fullName || fullName.trim(),
          department: updated.department || department,
          profilePicture: updated.profilePicture !== undefined ? updated.profilePicture : profilePicture,
          profileReviewStatus: updated.profileReviewStatus || "PENDING_APPROVAL",
        };
        saveAuthUser(updatedUser);
        setUser(updatedUser);
        setEditing(false);
        handleAction("Profile changes applied! Notification and approval request sent strictly to Admin.");
      } else {
        handleAction("Failed to update profile. Please try again.");
      }
    } catch {
      const updatedUser: AuthUser = { ...user, fullName, department, profilePicture: profilePicture || undefined };
      saveAuthUser(updatedUser);
      setUser(updatedUser);
      setEditing(false);
      handleAction("Profile updated locally.");
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

      {/* DOSSIER CARD */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                title="Click to view full photo"
                className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-purple-600/20 bg-slate-100 shrink-0 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 transition hover:shadow-md"
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={fullName || "Proctor"}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                  />
                ) : (
                  <Image
                    src="/proctor-vance.jpg"
                    alt="Dr. Arthur Vance"
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

              {editing && (
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-2xs transition cursor-pointer"
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
      {/* Photo Modal */}
      <PhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        photoSrc={profilePicture}
        defaultFallback="/proctor-vance.jpg"
        name={fullName || "Dr. Arthur Vance"}
        badge={user?.badgeNumber || "DSW Executive Dean #PR-109"}
        onEditPhoto={editing ? () => fileInputRef.current?.click() : undefined}
      />
    </div>
  );
}
