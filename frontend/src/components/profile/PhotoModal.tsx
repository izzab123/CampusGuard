"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Camera, Maximize2, Edit2 } from "lucide-react";

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoSrc?: string | null;
  defaultFallback?: string;
  name: string;
  badge?: string;
  onEditPhoto?: () => void;
  profileUrl?: string;
}

export default function PhotoModal({
  isOpen,
  onClose,
  photoSrc,
  defaultFallback = "/officer-vance.jpg",
  name,
  badge,
  onEditPhoto,
  profileUrl,
}: PhotoModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-slate-500" />
            <h3 className="font-bold text-sm text-slate-900">Profile Photo</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Photo Container */}
        <div className="p-6 flex flex-col items-center gap-4 bg-slate-50/50">
          <div className="w-64 h-64 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl bg-slate-100 flex items-center justify-center relative">
            {photoSrc ? (
              <img
                src={photoSrc}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : defaultFallback ? (
              <Image
                src={defaultFallback}
                alt={name}
                width={256}
                height={256}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full bg-[#0a2f77] text-white font-extrabold text-4xl flex items-center justify-center">
                {name ? name.slice(0, 2).toUpperCase() : "CG"}
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-900 text-sm">{name}</p>
            {badge && <p className="text-xs text-slate-500 mt-0.5">{badge}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
          {onEditPhoto ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditPhoto();
              }}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Change Photo</span>
            </button>
          ) : profileUrl ? (
            <Link
              href={profileUrl}
              onClick={onClose}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile &amp; Photo</span>
            </Link>
          ) : (
            <div></div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
