"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ArrowRight,
  Mail,
  AlertCircle,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { saveAuthUser, getRoleDashboardPath } from "@/lib/auth";

const SEED_ACCOUNTS = [
  { role: "Student", email: "student@campusguard.edu", name: "Alex Morgan" },
  { role: "Proctor and DSW", email: "proctor@campusguard.edu", name: "Dr. Arthur Vance" },
  { role: "Security Guard", email: "guard@campusguard.edu", name: "Officer Marcus Vance" },
  { role: "Shift Supervisor", email: "supervisor@campusguard.edu", name: "Elena Rostova" },
  { role: "Admin", email: "admin@campusguard.edu", name: "System Admin" },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fillSeedAccount = (account: typeof SEED_ACCOUNTS[0]) => {
    setEmail(account.email);
    setPassword("12345678");
    setRole(account.role);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
          role: role || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to sign in. Please check your credentials.");
      }

      saveAuthUser({
        email: data.email,
        role: data.role,
        fullName: data.fullName,
        badgeNumber: data.badgeNumber,
        department: data.department,
        token: data.token,
      });

      setSuccess(`Authenticated as ${data.fullName || data.email} (${data.role}). Redirecting...`);

      // Redirect to the role-specific dashboard
      const targetPath = getRoleDashboardPath(data.role);
      setTimeout(() => {
        router.push(targetPath);
      }, 600);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Network error: Could not reach the CampusGuard backend service.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between">
      {/* 1. TOP HEADER NAVIGATION */}
      <header className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-sm transition group-hover:bg-blue-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              CampusGuard
            </span>
          </Link>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              System Online
            </span>
            <div
              aria-label="User Profile"
              className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-xs"
            >
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN LOGIN FORM CONTAINER */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="max-w-[460px] w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-10">
          {/* Logo & Portal Heading */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">
                CampusGuard
              </span>
            </div>
            <h1 className="text-base font-semibold text-slate-800 tracking-tight">
              Institutional Clearance & Authentication
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Secure single sign-on access across institutional safety roles
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Notice</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="font-medium">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field 1: Email */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label
                  htmlFor="email"
                  className="font-semibold text-slate-800"
                >
                  Institutional Email
                </label>
                <span className="text-slate-400">Required</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@campusguard.edu"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label
                  htmlFor="password"
                  className="font-semibold text-slate-800"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="font-semibold text-blue-700 hover:text-blue-800 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Field 3: Five Institutional Roles */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="role" className="font-semibold text-slate-800">
                  Assigned Clearance Role
                </label>
                <span className="text-slate-400">5 Available Roles</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Shield className="w-4 h-4" />
                </div>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none transition cursor-pointer ${
                    role ? "text-slate-900 font-medium" : "text-slate-400"
                  }`}
                >
                  <option value="">
                    Auto-detect role from credentials (or choose)
                  </option>
                  <option value="Student">Student</option>
                  <option value="Proctor and DSW">Proctor and DSW</option>
                  <option value="Security Guard">Security Guard</option>
                  <option value="Shift Supervisor">Shift Supervisor</option>
                  <option value="Admin">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0a2f77] hover:bg-[#082660] text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Seed Accounts Quick-Fill Section */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Institutional Seed Accounts (Pass: 12345678)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              {SEED_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillSeedAccount(acc)}
                  className={`text-left p-2 rounded-lg border transition text-[11px] flex flex-col hover:border-blue-400 hover:bg-blue-50/50 ${
                    email === acc.email
                      ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold"
                      : "border-slate-200 bg-slate-50/70 text-slate-700"
                  }`}
                >
                  <span className="font-semibold text-slate-800">{acc.role}</span>
                  <span className="text-slate-500 truncate">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Subtle bottom decoration */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100">
        CampusGuard Security Operations Center • 24/7 Dispatch Hotline: x9110
      </footer>
    </div>
  );
}
