"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setDevResetUrl(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to initiate password reset for this email.");
      }

      setSuccessMessage(
        data.message || "Password reset instructions sent. Please check your institutional email."
      );
      if (data.resetUrl) {
        setDevResetUrl(data.resetUrl);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Network error: Could not reach the backend service.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              CampusGuard
            </span>
          </Link>
          <Link
            href="/login"
            className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-[440px] w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-10">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mx-auto mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Reset Your Password
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered institutional email to receive a secure password reset link.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Reset Request Notice</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2 text-xs text-emerald-800">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Reset Email Dispatched</p>
                  <p>{successMessage}</p>
                </div>
              </div>

              {devResetUrl && (
                <div className="pt-2 border-t border-emerald-200/70">
                  <p className="text-[11px] font-semibold text-emerald-900 mb-1">
                    Direct Reset Link (Local Testing):
                  </p>
                  <a
                    href={devResetUrl}
                    className="inline-flex items-center gap-1.5 text-blue-700 underline font-medium hover:text-blue-900 break-all text-[11px]"
                  >
                    <span>{devResetUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="email" className="font-semibold text-slate-800">
                  Institutional Email Address
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0a2f77] hover:bg-[#082660] text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-xs text-slate-500 hover:text-slate-800 transition"
            >
              Remembered your password? <span className="font-semibold text-blue-700">Sign In</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100">
        CampusGuard Security Operations Center • 24/7 Dispatch Hotline: x9110
      </footer>
    </div>
  );
}
