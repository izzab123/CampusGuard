"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  UserPlus,
  Shield,
  Mail,
  Lock,
  User,
  CreditCard,
  Building,
  Phone,
  Camera,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldAlert,
  Clock,
  Briefcase
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ROLE_OPTIONS = [
  {
    role: "Student",
    label: "Student",
    badgePrefix: "STU-",
    defaultDept: "Dept. of Computer Science & Engineering",
    icon: GraduationCap,
    desc: "Enrolled campus student with gate pass and safety bulletin access",
  },
  {
    role: "Security Guard",
    label: "Security Guard",
    badgePrefix: "GRD-",
    defaultDept: "Campus Perimeter & Gate Unit",
    icon: Shield,
    desc: "Field officer assigned to duty rosters, posts, and gate dispatch",
  },
  {
    role: "Shift Supervisor",
    label: "Shift Supervisor",
    badgePrefix: "SS-",
    defaultDept: "Security Operations Center (SOC)",
    icon: Clock,
    desc: "Shift lead managing attendance, reassignments, and alerts",
  },
  {
    role: "Proctor and DSW",
    label: "Proctor / DSW",
    badgePrefix: "PR-",
    defaultDept: "Office of Student Affairs & Proctorial Board",
    icon: ShieldAlert,
    desc: "Disciplinary authority handling infractions and high hazards",
  },
  {
    role: "Admin",
    label: "System Admin",
    badgePrefix: "ADM-",
    defaultDept: "Central IT & Campus Infrastructure",
    icon: Briefcase,
    desc: "Full administrative and root control across all modules",
  },
];

const DEPARTMENT_PRESETS = [
  "Dept. of Computer Science & Engineering",
  "Dept. of Electrical & Electronic Engineering",
  "Dept. of Civil Engineering",
  "Dept. of Business Administration",
  "Campus Perimeter & Gate Unit",
  "Security Operations Center (SOC)",
  "Night Patrol & Rapid Response",
  "Office of Student Affairs & Proctorial Board",
  "Central IT & Campus Infrastructure",
];

export default function CreateAccountModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAccountModalProps) {
  const [role, setRole] = useState("Student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [department, setDepartment] = useState("Dept. of Computer Science & Engineering");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // When role changes, suggest badge prefix and default department if untouched
  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    const selected = ROLE_OPTIONS.find((r) => r.role === newRole);
    if (selected) {
      if (!badgeNumber || ROLE_OPTIONS.some((r) => badgeNumber.startsWith(r.badgePrefix))) {
        const rand = Math.floor(100 + Math.random() * 900);
        setBadgeNumber(`${selected.badgePrefix}${rand}`);
      }
      setDepartment(selected.defaultDept);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
      setIsSubmitting(false);
      // Auto-suggest badge number for default role
      if (!badgeNumber) {
        setBadgeNumber(`STU-${Math.floor(1000 + Math.random() * 9000)}`);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Real-time validation for email ending with @campusguard.edu
  const cleanEmail = email.trim().toLowerCase();
  const isEmailDomainValid =
    cleanEmail.length > "@campusguard.edu".length && cleanEmail.endsWith("@campusguard.edu");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose an image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      setProfilePicture(base64);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfilePicture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg("Full name is required.");
      return;
    }

    if (!cleanEmail) {
      setErrorMsg("Email address is required.");
      return;
    }

    if (!cleanEmail.endsWith("@campusguard.edu") || cleanEmail === "@campusguard.edu") {
      setErrorMsg("Email must be an institutional address ending with @campusguard.edu");
      return;
    }

    if (!password.trim() || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (!badgeNumber.trim()) {
      setErrorMsg("ID / Badge number is required.");
      return;
    }

    if (!department.trim()) {
      setErrorMsg("Department is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(API_ENDPOINTS.auth.users, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          name: fullName.trim(),
          email: cleanEmail,
          password: password.trim(),
          role,
          badgeNumber: badgeNumber.trim(),
          department: department.trim(),
          phoneNumber: phoneNumber.trim(),
          profilePicture: profilePicture || null,
          status: "ACTIVE",
          enabled: true,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(`Account for ${data.fullName || cleanEmail} created successfully.`);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("campusguard:user-created", { detail: data }));
        }
        if (onSuccess) {
          onSuccess();
        }
        setTimeout(() => {
          onClose();
          // Reset form fields
          setFullName("");
          setEmail("");
          setPassword("");
          setBadgeNumber("");
          setProfilePicture(null);
          setPhoneNumber("");
        }, 1200);
      } else {
        setErrorMsg(data.error || data.message || "Failed to create account. Please try again.");
      }
    } catch {
      setErrorMsg("Network error connecting to backend service. Please ensure server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-[#0a2f77] to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-xs">
              <UserPlus className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Create Institutional Account</h2>
              <p className="text-[11px] text-blue-200">
                Provision a verified @campusguard.edu account into the live system database
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* NOTICE BANNERS */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. ROLE SELECTION */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Institutional Role <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ROLE_OPTIONS.map((opt) => {
                const isSelected = role === opt.role;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => handleRoleChange(opt.role)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                      isSelected
                        ? "border-[#0a2f77] bg-blue-50/70 text-[#0a2f77] ring-1 ring-[#0a2f77]"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${isSelected ? "text-[#0a2f77]" : "text-slate-400"}`} />
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#0a2f77]"></span>
                      )}
                    </div>
                    <span className="text-xs font-bold mt-1">{opt.label}</span>
                    <span className="text-[10px] text-slate-500 leading-tight line-clamp-1">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. PROFILE PICTURE UPLOAD */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    <span>{profilePicture ? "Change Picture" : "Upload Picture"}</span>
                  </button>
                  {profilePicture && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  PNG, JPG or WEBP (up to 5MB). Photo will be permanently linked to this account.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* 3. BASIC CREDENTIALS: FULL NAME & EMAIL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a2f77] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Email Address with @campusguard.edu validation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Institutional Email <span className="text-rose-500">*</span>
                </label>
                {cleanEmail && (
                  <span
                    className={`text-[10px] font-bold ${
                      isEmailDomainValid ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isEmailDomainValid ? "✓ @campusguard.edu" : "Must end with @campusguard.edu"}
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campusguard.edu"
                  className={`w-full pl-9 pr-3 py-2 bg-white border rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                    cleanEmail && !isEmailDomainValid
                      ? "border-rose-300 focus:ring-rose-500"
                      : cleanEmail && isEmailDomainValid
                      ? "border-emerald-300 focus:ring-emerald-500"
                      : "border-slate-300 focus:ring-[#0a2f77]"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 4. PASSWORD & ID/BADGE NUMBER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Account Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set initial password"
                  className="w-full pl-9 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a2f77] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* ID / Badge Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ID / Badge Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  placeholder="e.g. STU-2024-001 or GRD-109"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a2f77] focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* 5. DEPARTMENT & PHONE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  list="department-options"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Select or enter department"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a2f77] focus:border-transparent transition"
                />
                <datalist id="department-options">
                  {DEPARTMENT_PRESETS.map((dept) => (
                    <option key={dept} value={dept} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Phone Number (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a2f77] focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (cleanEmail.length > 0 && !isEmailDomainValid)}
              className="px-5 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
