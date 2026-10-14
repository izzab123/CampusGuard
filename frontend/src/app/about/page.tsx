import React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header (kept minimal and consistent with other pages) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-sm transition group-hover:bg-blue-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              CampusGuard
            </span>
          </Link>

          <nav className="flex items-center">
            <div className="bg-slate-100/90 p-1 rounded-lg border border-slate-200/70 flex items-center gap-1">
              <Link href="/" className="px-4 py-1.5 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 transition">
                Home
              </Link>
              <Link href="/features" className="px-4 py-1.5 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 transition">
                Features
              </Link>
              <Link href="/about" className="px-4 py-1.5 rounded-md text-sm font-semibold bg-blue-700 text-white shadow-xs">
                About
              </Link>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded-md shadow-xs transition duration-150 cursor-pointer">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="text-center max-w-3xl mx-auto py-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 mb-4">
              Empowering Campuses with Unified Safety Infrastructure
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              CampusGuard bridges physical security dispatch, parking compliance, and student welfare into an integrated, real-time response platform.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200/80 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-3">Our Story</h2>
              <p className="text-sm text-slate-600">
                CampusGuard began in 2026 when campus safety teams sought to replace fragmented paper dispatch, siloed radios, and manual parking checks with a single, accountable platform that reduces response latency and administrative burden.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-3">Our Core Purpose</h2>
              <p className="text-sm text-slate-600 mb-4">
                Provide higher education institutions with rapid, transparent, and compassionate safety infrastructure that empowers officers and reassures students.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="inline-flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-1" />
                  Accountability in every shift
                </li>
                <li className="inline-flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-1" />
                  Frictionless incident routing
                </li>
              </ul>
            </div>
          </section>

          <section className="mt-10">
            <div className="bg-[#fbfdff] border border-slate-200/80 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Core Capabilities</h3>
              <p className="text-sm text-slate-600">Instant safe-walk escorts, hardware-free parking validation, biometric shift handoff, and proctor triage—all designed for campus operations.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
