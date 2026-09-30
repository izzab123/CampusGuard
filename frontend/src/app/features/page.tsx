"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Shield,
  User,
  LayoutGrid,
  PersonStanding,
  Sunrise,
  SquareCheck,
  Phone,
  Headphones
} from "lucide-react";

interface FeatureModule {
  id: string;
  title: string;
  description: string;
  badgeText: string;
  badgeType: "blue" | "red" | string;
  iconType: "escort" | "alert" | "roster" | string;
}

interface FeaturesData {
  badge: string;
  heroTitle: string;
  heroDescription: string;
  sectionTag: string;
  sectionTitle: string;
  sectionSubtitle: string;
  modules: FeatureModule[];
  cta: {
    title: string;
    description: string;
    buttonText: string;
    supportText: string;
  };
}

const DEFAULT_FEATURES_DATA: FeaturesData = {
  badge: "CAMPUSGUARD CAPABILITIES & PLATFORM ARCHITECTURE",
  heroTitle: "Everything You Need in One Place",
  heroDescription:
    "A unified, institutional safety ecosystem engineered for modern universities. Seamlessly connect students, patrol officers, shift supervisors, and campus security officers discharge under a single verified umbrella.",
  sectionTag: "COMPREHENSIVE DISPATCH MODULES",
  sectionTitle: "Engineered for High-Density Campus Environments",
  sectionSubtitle:
    "Every module integrates directly with existing legacy campus physical infrastructure, central PBX phone lines, and institutional active directory accounts.",
  modules: [
    {
      id: "safe-walk-escort",
      title: "Instant Safe Walk Escort Dispatch",
      description:
        "On-demand vetted student safety escorts, officer telemetry, and estimated arrival times under 6 minutes across all campus quadrants and parking decks.",
      badgeText: "14 Active Units on Patrol",
      badgeType: "blue",
      iconType: "escort"
    },
    {
      id: "incident-triage",
      title: "Real-Time Incident Intake & Triage",
      description:
        "Multi-category reporting pipeline for suspicious vehicles, facility hazards, and welfare checks with anonymous submission toggles and immediate Campus Police NOC routing.",
      badgeText: "Priority 1 Callout Support",
      badgeType: "red",
      iconType: "alert"
    },
    {
      id: "shift-handoff",
      title: "Security Guard Roster & Shift Handoff",
      description:
        "End-to-end command logging, post assignments, tamper-evident digital shift logs, and instant incident escalation protocols for field security personnel.",
      badgeText: "Immutable Security Audit Trail",
      badgeType: "blue",
      iconType: "roster"
    }
  ],
  cta: {
    title: "Ready to Secure Your Campus Community?",
    description:
      "Join leading academic institutions utilizing CampusGuard for unified physical safety, rapid emergency dispatch, and credential management.",
    buttonText: "Contact Security Office",
    supportText: "24/7 dedicated support"
  }
};

export default function FeaturesPage() {
  const [data, setData] = useState<FeaturesData>(DEFAULT_FEATURES_DATA);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  useEffect(() => {
    // Attempt fetching live feature config from Spring Boot backend
    const fetchBackendFeatures = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/features");
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setBackendConnected(true);
        }
      } catch {
        // Fallback remains active seamlessly
        setBackendConnected(false);
      }
    };

    fetchBackendFeatures();
  }, []);

  const renderModuleIcon = (iconType: string) => {
    switch (iconType) {
      case "escort":
        return <PersonStanding className="w-6 h-6 text-blue-700" />;
      case "alert":
        return <Sunrise className="w-6 h-6 text-blue-700" />;
      case "roster":
      default:
        return <SquareCheck className="w-6 h-6 text-blue-700" />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between">
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
                className="px-4 py-1.5 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 transition"
              >
                Home
              </Link>
              <Link
                href="/features"
                className="px-4 py-1.5 rounded-md text-sm font-semibold bg-blue-700 text-white shadow-xs"
              >
                Features
              </Link>
              <Link
                href="/#about"
                className="px-4 py-1.5 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 transition"
              >
                About
              </Link>
            </div>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-md shadow-xs transition duration-150 cursor-pointer">
              Login
            </button>
            <button
              aria-label="User Profile"
              className="w-9 h-9 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center text-white shadow-xs transition duration-150 cursor-pointer"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {/* 2. HERO / PLATFORM ARCHITECTURE SECTION */}
        <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/70 text-blue-700 text-xs font-semibold tracking-wider uppercase mb-6 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>{data.badge}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {data.heroTitle}
          </h1>

          {/* Subtitle Description */}
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            {data.heroDescription}
          </p>

          {backendConnected && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Synchronized with Spring Boot Backend
            </div>
          )}
        </section>

        {/* 3. COMPREHENSIVE DISPATCH MODULES SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Section Header */}
          <div className="mb-8">
            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 mb-2">
              <LayoutGrid className="w-4 h-4 text-blue-700" />
              <span>{data.sectionTag}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {data.sectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              {data.sectionSubtitle}
            </p>
          </div>

          {/* 3 Modules Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.modules.map((mod) => (
              <div
                key={mod.id}
                className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Card Top Row: Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-blue-100/80 flex items-center justify-center shadow-2xs">
                      {renderModuleIcon(mod.iconType)}
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                        mod.badgeType === "red"
                          ? "bg-slate-100/90 border-slate-200 text-slate-800"
                          : "bg-blue-50/80 border-blue-100 text-blue-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          mod.badgeType === "red" ? "bg-red-500" : "bg-blue-600"
                        }`}
                      ></span>
                      <span>{mod.badgeText}</span>
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2 tracking-tight">
                    {mod.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {mod.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. CALL TO ACTION SECTION (Ready to Secure Your Campus Community?) */}
        <section className="bg-blue-700 text-white py-20 px-4 sm:px-6 lg:px-8 mt-16 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Centered Translucent Shield Badge */}
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mx-auto mb-6 backdrop-blur-xs shadow-sm">
              <Shield className="w-6 h-6 text-white" />
            </div>

            {/* CTA Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              {data.cta.title}
            </h2>

            {/* CTA Subtitle */}
            <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed mb-8">
              {data.cta.description}
            </p>

            {/* Contact Button */}
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3 rounded-lg border border-blue-400/40 shadow-sm inline-flex items-center gap-2 transition duration-150 cursor-pointer">
              <Phone className="w-4 h-4 text-white" />
              <span>{data.cta.buttonText}</span>
            </button>

            {/* Subtext info */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-blue-200">
              <span className="w-1 h-1 rounded-full bg-blue-300"></span>
              <div className="flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-blue-200" />
                <span>{data.cta.supportText}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. FOOTER */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Attribution */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-700 flex items-center justify-center text-white shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm tracking-tight text-slate-900">
                CampusGuard
              </span>
            </Link>
            <p className="text-xs text-slate-500 mt-2 max-w-md leading-normal">
              CampusGuard — University Security Infrastructure Platform. Developed in partnership with University Campus Safety &amp; Student Affairs Administration.
            </p>
          </div>

          {/* Footer Navigation */}
          <nav className="flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
            <Link href="/#about" className="hover:text-blue-700 transition">
              About
            </Link>
            <Link href="/features" className="hover:text-blue-700 transition text-blue-700 font-semibold">
              Features
            </Link>
            <Link href="/#contact" className="hover:text-blue-700 transition">
              Contact
            </Link>
            <Link href="/#login" className="hover:text-blue-700 transition">
              Login
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
