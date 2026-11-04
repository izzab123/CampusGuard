"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { getStoredAuthUser, saveAuthUser, performLogout, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";
import PhotoModal from "./PhotoModal";

interface TopProfileBadgeProps {
  profileUrl: string;
  defaultFallbackPhoto?: string;
  defaultName?: string;
  defaultBadge?: string;
  showLogout?: boolean;
  accentBg?: string;
  badgeSubtext?: string;
}

export default function TopProfileBadge({
  profileUrl,
  defaultFallbackPhoto = "/officer-vance.jpg",
  defaultName = "Officer Marcus Vance",
  defaultBadge = "Shield #4082",
  showLogout = true,
  accentBg = "bg-[#0a2f77]",
  badgeSubtext,
}: TopProfileBadgeProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  useEffect(() => {
    const syncProfile = () => {
      const stored = getStoredAuthUser();
      if (stored) {
        setUser(stored);
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
                  profilePicture:
                    data.profilePicture !== undefined
                      ? data.profilePicture
                      : stored.profilePicture,
                  profileReviewStatus:
                    data.profileReviewStatus || stored.profileReviewStatus,
                };
                saveAuthUser(updated);
                setUser(updated);
              }
            })
            .catch(() => {});
        }
      }
    };

    syncProfile();

    const handleAuthChange = (e: any) => {
      if (e.detail) {
        setUser(e.detail);
      } else {
        setUser(getStoredAuthUser());
      }
    };

    window.addEventListener("campusguard_auth_change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("campusguard_auth_change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const displayName = user?.fullName || user?.name || defaultName;
  const displayBadge = user?.badgeNumber
    ? user.badgeNumber.startsWith("#") || user.badgeNumber.startsWith("Shield")
      ? user.badgeNumber
      : `#${user.badgeNumber}`
    : defaultBadge;
  const photo = user?.profilePicture || null;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "CG";

  return (
    <>
      <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
        {/* Profile Avatar Button - Click to open Photo Modal */}
        <button
          type="button"
          onClick={() => setIsPhotoModalOpen(true)}
          title="Click to view full photo"
          className={`w-9 h-9 rounded-full overflow-hidden ${accentBg} ring-1 ring-slate-200 relative flex items-center justify-center text-white font-bold text-xs shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500 transition group`}
        >
          {photo ? (
            <img
              src={photo}
              alt={displayName}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-150"
            />
          ) : defaultFallbackPhoto ? (
            <>
              <Image
                src={defaultFallbackPhoto}
                alt={displayName}
                width={36}
                height={36}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-150"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="absolute">{initials}</span>
            </>
          ) : (
            <span>{initials}</span>
          )}
        </button>

        {/* Name and Badge Details - Link to Profile Page */}
        <Link
          href={profileUrl}
          className="hidden lg:flex flex-col text-left group cursor-pointer"
        >
          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition leading-tight">
            {displayName}
          </span>
          <span className="text-[11px] text-slate-500 leading-tight">
            {badgeSubtext || displayBadge}
          </span>
        </Link>

        {/* Optional Logout Button */}
        {showLogout && (
          <button
            type="button"
            onClick={() => performLogout()}
            title="Log out"
            className="ml-1 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Enlarged Photo Modal */}
      <PhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        photoSrc={photo}
        defaultFallback={defaultFallbackPhoto}
        name={displayName}
        badge={badgeSubtext || displayBadge}
        profileUrl={profileUrl}
      />
    </>
  );
}

