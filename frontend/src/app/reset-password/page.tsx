"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [accountEmail, setAccountEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      // Validate token on mount
      fetch(`${getApiUrl()}/api/auth/validate-token?token=${encodeURIComponent(tokenFromUrl)}`)
        .then(async (res) => {
          const data = await res.json();
          if (res.ok && data.valid) {
            setTokenValid(true);
            setAccountEmail(data.email || null);
          } else {
            setTokenValid(false);
            setError(data.message || "Invalid or expired reset token.");
          }
        })
        .catch(() => {
          // If backend isn't reachable or network error, let user proceed to try submitting
          setTokenValid(true);
        })
        .finally(() => {
          setValidating(false);
        });
    } else {
      setValidating(false);
      setTokenValid(false);
      setError("No reset token provided in URL. Please click the link received in your email.");
    }
  }, [tokenFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters in length.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify and re-type.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${getApiUrl()}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token.trim(),
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccess("Your password has been reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Network error: Could not complete password reset.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[440px] w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-10">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mx-auto mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Create New Password
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {accountEmail
            ? `Setting new password for ${accountEmail}`
            : "Please enter and confirm your new institutional account password."}
        </p>
      </div>

      {validating && (
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-blue-700" />
          <span>Validating security token...</span>
        </div>
      )}

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Reset Verification Notice</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="font-medium">{success}</p>
        </div>
      )}

      {!validating && tokenValid && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hidden/Editable Token field if user needed to paste */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label htmlFor="token" className="font-semibold text-slate-800">
                Security Reset Token
              </label>
              <span className="text-slate-400">Validated</span>
            </div>
            <input
              id="token"
              type="text"
              required
              readOnly
              value={token}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono focus:outline-none"
            />
          </div>

          {/* New Password */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label htmlFor="newPassword" className="font-semibold text-slate-800">
                New Password
              </label>
              <span className="text-slate-400">Min 6 characters</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label htmlFor="confirmPassword" className="font-semibold text-slate-800">
                Confirm New Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0a2f77] hover:bg-[#082660] text-white font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {tokenValid === false && !validating && (
        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-blue-700 hover:text-blue-900"
          >
            Request a fresh password reset email
          </Link>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-xs text-slate-500 hover:text-slate-800 transition"
        >
          Return to <span className="font-semibold text-blue-700">Sign In</span>
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between">
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
            className="text-xs font-semibold text-blue-700 hover:text-blue-800"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={
          <div className="text-center text-sm text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-700" />
            Loading reset portal...
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100">
        CampusGuard Security Operations Center • 24/7 Dispatch Hotline: x9110
      </footer>
    </div>
  );
}
