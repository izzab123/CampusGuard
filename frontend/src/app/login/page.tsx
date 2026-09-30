"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ArrowRight,
  IdCard
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend mock submit
    console.log("Signing in with:", { identifier, role });
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

          {/* Right Action: User Icon */}
          <div className="flex items-center">
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
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-[440px] w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs p-8 sm:p-10">
          {/* Logo & Portal Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-2xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">
                CampusGuard
              </span>
            </div>
            <h1 className="text-base font-semibold text-slate-800 tracking-tight">
              Institutional Portal
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field 1: University ID or email */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label
                  htmlFor="identifier"
                  className="font-semibold text-slate-800"
                >
                  University ID or email
                </label>
                <span className="text-slate-400">Required</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <IdCard className="w-4 h-4" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. j.doe@campus.edu or ID #84920"
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
                <a
                  href="#forgot"
                  className="font-semibold text-blue-700 hover:text-blue-800 transition"
                >
                  Forgot password?
                </a>
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

            {/* Field 3: Role */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="role" className="font-semibold text-slate-800">
                  Role
                </label>
                <span className="text-slate-400">Clearance Level</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Shield className="w-4 h-4" />
                </div>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className={`w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none transition cursor-pointer ${
                    role ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  <option value="" disabled>
                    Select your institutional role
                  </option>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty &amp; Academic Staff</option>
                  <option value="officer">Campus Security Officer</option>
                  <option value="supervisor">Shift Supervisor / Dispatcher</option>
                  <option value="admin">System Administrator</option>
                  <option value="visitor">Visitor / Temporary Pass Holder</option>
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
                className="w-full bg-[#0a2f77] hover:bg-[#082660] text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-xs transition duration-150 cursor-pointer"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Subtle bottom decoration */}
      <div className="h-12 bg-transparent pointer-events-none" />
    </div>
  );
}
