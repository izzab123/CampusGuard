import React from "react";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  ArrowRight,
  Clock,
  QrCode,
  User,
  Users,
  CheckCircle2,
  Building2,
  FileText,
  RefreshCw,
  GraduationCap,
  HeartPulse
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. TOP HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
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

          {/* Navigation Pill Container */}
          <nav className="flex items-center">
            <div className="bg-slate-100/90 p-1 rounded-lg border border-slate-200/70 flex items-center gap-1">
              <Link
                href="/"
                className="px-4 py-1.5 rounded-md text-sm font-semibold bg-blue-700 text-white shadow-xs"
              >
                Home
              </Link>
              <Link
                href="/features"
                className="px-4 py-1.5 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 transition"
              >
                Features
              </Link>
              <a
                href="#about"
                className="px-4 py-1.5 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 transition"
              >
                About
              </a>
            </div>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded-md shadow-xs transition duration-150 cursor-pointer"
            >
              Login
            </Link>
            <Link
              href="/login"
              aria-label="User Profile"
              className="w-9 h-9 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center text-white shadow-xs transition duration-150 cursor-pointer"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. OPERATIONAL STATUS BAR */}
      <div className="bg-[#fcfdfd] border-b border-slate-200/80 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2.5 text-xs">
          <span className="inline-flex items-center gap-1.5 font-bold tracking-wider text-emerald-600 uppercase text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            + OPERATIONAL STATUS
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600 font-medium">
            Central Dispatch & Campus Grid: Fully Synchronized
          </span>
        </div>
      </div>

      <main id="home">
        {/* 3. HERO SECTION */}
        <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute top-0 right-0 -z-10 w-[550px] h-[550px] bg-gradient-to-bl from-blue-100/50 via-indigo-50/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold tracking-wider uppercase mb-6">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Unified Higher Education Safety Grid</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-slate-950 leading-[1.12] mb-6">
                Smart security for a{" "}
                <span className="text-blue-700">safer campus</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl font-normal">
                Unifying shift management, hardware-free parking validation, and real-time incident escalation into a single institutional command system.
              </p>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
                <Link
                  href="/login"
                  className="bg-[#0f2c64] hover:bg-[#0b224d] text-white text-sm font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm transition duration-150 cursor-pointer"
                >
                  <span>Login to CampusGuard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-sm font-medium px-4 py-3 rounded-lg flex items-center gap-2 transition duration-150 cursor-pointer">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Institutional Single Sign-On (SSO) Supported</span>
                </button>
              </div>

              {/* Guarantees / Checklist */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Sub-second biometric log-in</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Zero external parking sensors</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Direct DSW alert routing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. OPERATIONAL CHALLENGE & SOLUTION CALLOUT */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Pill Tag */}
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold tracking-wider uppercase mb-5">
              Operational Challenge & Solution
            </div>

            {/* Problem Statement */}
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 font-normal max-w-2xl mx-auto">
              Campus safety departments struggle with fragmented manual guard log sheets, un-tracked shift no-shows, and decentralized incident reports that delay dispatch.
            </p>

            {/* Solution Banner Box */}
            <div className="bg-[#eef5ff] border border-[#bcd7ff] rounded-xl p-5 md:py-5 md:px-8 shadow-xs">
              <p className="text-slate-900 text-sm sm:text-base font-medium leading-snug">
                CampusGuard replaces paper trails with automated attendance verification, QR enforcement, and direct proctor escalation in real time.
              </p>
            </div>
          </div>
        </section>

        {/* 5. METRIC / STAT CARDS */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-[#fbfdff] border border-slate-200/90 rounded-2xl p-8 text-center hover:shadow-md hover:border-blue-300 transition duration-200">
                <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-4xl font-extrabold text-slate-900 mb-1 tracking-tight">
                  99.4%
                </div>
                <div className="text-base font-bold text-slate-900 mb-2">
                  Shift Compliance
                </div>
                <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
                  Automated biometric shift affirmations
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#fbfdff] border border-slate-200/90 rounded-2xl p-8 text-center hover:shadow-md hover:border-blue-300 transition duration-200">
                <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="text-4xl font-extrabold text-slate-900 mb-1 tracking-tight">
                  Zero Hardware
                </div>
                <div className="text-base font-bold text-slate-900 mb-2">
                  Parking Infrastructure
                </div>
                <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
                  Dynamic time-tokens QR scans permit zero-gate expense
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#fbfdff] border border-slate-200/90 rounded-2xl p-8 text-center hover:shadow-md hover:border-blue-300 transition duration-200">
                <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="text-4xl font-extrabold text-slate-900 mb-1 tracking-tight">
                  Incident Report
                </div>
                <div className="text-base font-bold text-slate-900 mb-2">
                  Incident Routing
                </div>
                <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
                  Direct alert transmission from field post to University Proctor & DSW based on severity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. ENGINEERED FOR CAMPUS RESILIENCE (4 CORE MODULES) */}
        <section id="features" className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
                Engineered for Campus Resilience
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Four core modules purpose-built for campus security teams and student safety.
              </p>
            </div>

            {/* 4 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-6 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition duration-200">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Digital shift handoff
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-6">
                    Seamless shift handins with checkpoint logs and instant officer sign-off.
                  </p>
                </div>
                <div className="text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 group cursor-pointer">
                  <span>Audit-ready trails</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-6 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition duration-200">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Automated no-show escalation
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-6">
                    Instant supervisory alert and automatic re-routing if a guard post remains unstaffed after 15 minutes.
                  </p>
                </div>
                <div className="text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 group cursor-pointer">
                  <span>Zero-gap coverage</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-6 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition duration-200">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Hardware-free QR parking
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-6">
                    Permit validation and visitor stall checks guaranteed simply using dynamic QR scans without kiosks or plate regs.
                  </p>
                </div>
                <div className="text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 group cursor-pointer">
                  <span>On-device scanning</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-6 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition duration-200">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Incident routing to Proctor/DSW
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-6">
                    Direct triaging matrix sending safety alerts instantly to the University Proctor and Dean of Student Welfare.
                  </p>
                </div>
                <div className="text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 group cursor-pointer">
                  <span>Escalation matrix</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. HOW CAMPUSGUARD WORKS (4-STEP CHAIN OF CUSTODY) */}
        <section className="py-16 md:py-20 bg-[#fafcff] border-t border-b border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
                How CampusGuard Works
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                A seamless 4-step chain of custody and situational triage designed for high-accountability deployments.
              </p>
            </div>

            {/* 4 Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 transition duration-200">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-8 h-8 rounded-full bg-[#0f2c64] text-white flex items-center justify-center font-bold text-xs">
                      01
                    </span>
                    <Building2 className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Guard logs in
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-6">
                    Officer verifies biometric or SSO credentials at shift onset to activate duty logs.
                  </p>
                </div>
                <div className="text-[11px] font-medium text-slate-400 pt-3 border-t border-slate-100">
                  Step 1 of 4
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 transition duration-200">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-8 h-8 rounded-full bg-[#0f2c64] text-white flex items-center justify-center font-bold text-xs">
                      02
                    </span>
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Handles shift/incident
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-6">
                    Conducts digital prowl logs and flags safety occurrences in real-time with attachments.
                  </p>
                </div>
                <div className="text-[11px] font-medium text-slate-400 pt-3 border-t border-slate-100">
                  Step 2 of 4
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 transition duration-200">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-8 h-8 rounded-full bg-[#0f2c64] text-white flex items-center justify-center font-bold text-xs">
                      03
                    </span>
                    <RefreshCw className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    System escalates if needed
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-6">
                    Algorithms trigger alerts supervisors re anomalies, miss than parameters, or no shows.
                  </p>
                </div>
                <div className="text-[11px] font-medium text-slate-400 pt-3 border-t border-slate-100">
                  Step 3 of 4
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 transition duration-200">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-8 h-8 rounded-full bg-[#0f2c64] text-white flex items-center justify-center font-bold text-xs">
                      04
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Proctor/DSW resolves
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-6">
                    Administrative dashboard enables immediate clearance, resolution dispatch, and audit filing.
                  </p>
                </div>
                <div className="text-[11px] font-medium text-slate-400 pt-3 border-t border-slate-100">
                  Step 4 of 4
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. ROLE-BASED ACCESS FOR CAMPUS STAKEHOLDERS */}
        <section id="about" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
                Role-Based Access for Campus Stakeholders
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Engineered consoles personalized for authority tiers, duty responsibilities, and situational response needs.
              </p>
            </div>

            {/* 5 Role Cards in row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Role 1: Guard */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">Guard</span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold mb-3">
                    Field Security
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mobile-optimized checkpoint terminal, rapid QR validation, and incident reporting pad.
                  </p>
                </div>
              </div>

              {/* Role 2: Supervisor */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">Supervisor</span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold mb-3">
                    Patrol Operations
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Live duty roster view, post occupancy monitors, and immediate reserve dispatch triggers.
                  </p>
                </div>
              </div>

              {/* Role 3: Proctor */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">Proctor</span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold mb-3">
                    Administrative Audit
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Institutional discipline consoles, major incident remediations, and disciplinary seals.
                  </p>
                </div>
              </div>

              {/* Role 4: DSW */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">DSW</span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold mb-3">
                    Dean Student Welfare
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Student safety escalation terminal, residential hostel alerts, and student counseling routing.
                  </p>
                </div>
              </div>

              {/* Role 5: Student/Staff */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900 text-sm">Student/Staff</span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold mb-3">
                    Campus Community
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Instant SOS emergency broadcast, dynamic parking pass wallet, and live escort request portal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. BOTTOM BLUE CTA BANNER */}
        <section className="bg-[#1746a2] text-white py-12 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                  Ready to deploy CampusGuard for your institution?
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm max-w-2xl font-light">
                  Get institutional setup in under 48 hours with existing single sign-on directory synchronization.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button className="bg-white text-[#1746a2] hover:bg-blue-50 font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-sm transition duration-150 cursor-pointer">
                  Request Institutional Demo
                </button>
                <button className="bg-transparent hover:bg-blue-800/40 border border-white/60 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-lg transition duration-150 cursor-pointer">
                  View Protocol Docs
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 10. FOOTER */}
      <footer className="bg-white text-slate-500 text-xs border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2 text-slate-600">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>CampusGuard is developed in partnership with University Campus Safety & Student Affairs Administration.</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-600 font-medium">
              <a href="#about" className="hover:text-blue-700 transition">About</a>
              <Link href="/features" className="hover:text-blue-700 transition">Features</Link>
              <a href="#about" className="hover:text-blue-700 transition">Contact</a>
              <Link href="/login" className="hover:text-blue-700 transition">Login</Link>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                System Status
              </span>
              <a href="#about" className="hover:text-blue-700 transition">Privacy & Security Policy</a>
            </div>
          </div>

          {/* Middle row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4 border-b border-slate-100 text-slate-500 text-[11px]">
            <div>
              © 2026 CampusGuard Platform. All rights reserved. Encrypted with university-grade security.
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>AES-256 Transport Encryption Active</span>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-4 text-[11px] text-slate-400">
            <div>
              <span className="font-semibold text-slate-600">CampusGuard</span> — University Security Infrastructure Platform
            </div>
            <div>
              © 2026 CampusGuard Safety Systems. All institutional rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
