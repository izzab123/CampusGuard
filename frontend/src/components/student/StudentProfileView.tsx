"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Edit3,
  Download,
  LogOut,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  Home,
  Car,
  CheckCircle2,
  Plus,
  RefreshCw,
  PhoneCall,
  Smartphone,
  Key,
  Shield,
  ExternalLink,
  Lock
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function StudentProfileView() {
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Privacy toggles
  const [privacy, setPrivacy] = useState({
    safeWalkGps: true,
    reportAttribution: true,
  });

  const togglePrivacy = (key: keyof typeof privacy) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Notice Banner */}
      {actionNotice && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <span>{actionNotice}</span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-blue-700 hover:text-blue-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP HEADER & ACTION BUTTONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
            <span>CAMPUS IDENTITY &amp; PHYSICAL ACCESS</span>
            <span className="text-slate-300">•</span>
            <span className="text-blue-700">Active Session</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Student Identity &amp; Access Profile
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl mt-0.5 leading-relaxed">
            Manage your campus security credentials, registered vehicles, trusted emergency contacts, and privacy settings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => handleAction("Opening profile editor...")}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Profile</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction("Digital Student ID card generated and downloaded.")}
            className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Digital ID Card</span>
          </button>
          <button
            type="button"
            onClick={() => performLogout()}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-red-50 hover:border-red-200 text-red-600 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID: IDENTITY & VEHICLE (65%) + CONTACTS & PRIVACY (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: HERO CARD + VEHICLE REGISTRATION */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. SECURE ENROLLMENT ID-CARD (HERO) */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            {/* Dark Blue Header Banner */}
            <div className="bg-[#0a2f77] text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold tracking-wider uppercase">
                  SECURE ENROLLMENT ID-CARD
                </span>
              </div>
              <span className="text-[10px] font-mono text-blue-200">
                CAMPUSGUARD AUTHENTICATED
              </span>
            </div>

            {/* Inner Body */}
            <div className="p-6 space-y-6">
              {/* Photo & Main Identity info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-blue-700/20 bg-slate-100 shrink-0">
                    <Image
                      src="/student-alex.jpg"
                      alt="Alex Morgan"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-slate-900 leading-none">
                        Alex Morgan
                      </h2>
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      Senior Undergrad - Class of 2025
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-600">
                      <span className="font-bold text-blue-800">#STU-88201</span>
                      <span className="text-slate-300">•</span>
                      <span>RFID: #882D-A</span>
                      <span className="text-slate-300">•</span>
                      <span>FIDO2: Tier-1</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 self-start sm:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    ENROLLED • FULL TIME
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    <ShieldCheck className="w-3 h-3 text-blue-700" />
                    <span>ID VERIFIED • BIOMETRICS ON FILE</span>
                  </div>
                </div>
              </div>

              {/* 4 Identity Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-slate-100 text-xs">
                {/* Department */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-700" />
                    <span>Department</span>
                  </div>
                  <div className="font-bold text-slate-900">
                    Computer Science &amp; Engineering
                  </div>
                </div>

                {/* Campus Email */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-700" />
                    <span>Campus Email</span>
                  </div>
                  <div className="font-bold font-mono text-blue-700">
                    a.morgan@campusguard.edu
                  </div>
                </div>

                {/* Primary Phone */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-700" />
                    <span>Primary Phone</span>
                  </div>
                  <div className="font-bold font-mono text-slate-900">
                    +1 (555) 019-8820
                  </div>
                </div>

                {/* Campus Residence */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-blue-700" />
                    <span>Campus Residence</span>
                  </div>
                  <div className="font-bold text-slate-900">
                    West Quad Residence Hall B, Room 314 <span className="text-slate-500 font-normal">(Swipe Authorized)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. VEHICLE & PARKING REGISTRATION */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-700" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Vehicle &amp; Parking Registration
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Automated license recognition &amp; resident lot credentials
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                ACTIVE PERMIT
              </span>
            </div>

            {/* Split Subcard: Vehicle & Stall */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              {/* Primary Vehicle */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Primary Vehicle
                </div>
                <div className="text-sm font-extrabold text-slate-900">
                  2022 Honda Civic
                </div>
                <div className="text-[11px] text-slate-500">Modern Gray Metallic</div>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400">PLATE:</span>
                  <span className="px-2.5 py-1 rounded bg-white border border-slate-300 font-mono font-extrabold text-slate-900 text-xs shadow-2xs flex items-center gap-1.5">
                    7XYZ-42
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                  </span>
                </div>
              </div>

              {/* Permit Tier & Space */}
              <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-4 pt-3 sm:pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Permit Tier &amp; Space
                  </span>
                  <span className="text-[10px] font-bold text-blue-700">
                    Tier-1 Student Resident Annual
                  </span>
                </div>
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-[#0a2f77] text-white flex items-center justify-center font-bold text-xs">
                    P
                  </span>
                  <span>Lot C • Deck 3 • Assigned Space #314</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Gate Telemetry <span className="font-mono text-slate-700">#RFID-98201-C</span> (Windshield transponder synced)
                </div>
                <div className="pt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    AUTO-LIFT ENABLED
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleAction("Register vehicle wizard loaded.")}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register New Vehicle</span>
              </button>
              <button
                type="button"
                onClick={() => handleAction("License plate update dialog ready.")}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition shadow-xs cursor-pointer"
              >
                Update License Plate
              </button>
              <button
                type="button"
                onClick={() => handleAction("Transfer permit application opened.")}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition shadow-xs cursor-pointer"
              >
                Transfer Permit
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTACTS, BIOMETRICS & PRIVACY */}
        <div className="space-y-5">
          {/* Card 1: Emergency Contacts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Emergency Contacts</h3>
                <p className="text-[11px] text-slate-500">2 Confirmed Trusted Contacts</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                VERIFIED
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Contact 1: Sarah Morgan (Parent) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      PRIMARY CONTACT • NEXT OF KIN
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-200 text-slate-700">
                      RELATION: PARENT
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 mt-1">Sarah Morgan</div>
                  <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                    +1 (555) 392-1084
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAction("Calling Sarah Morgan (+1 555 392-1084)...")}
                  className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center transition cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Contact 2: Marcus Vance (RA) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      SECONDARY CONTACT • ON CAMPUS
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-200 text-slate-700">
                      RESIDENT ASSISTANT
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 mt-1">Marcus Vance</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    RA South Quad • Ext. 8421
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAction("Calling RA Marcus Vance (Ext 8421)...")}
                  className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center transition cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAction("Emergency contacts manager opened.")}
              className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition shadow-xs cursor-pointer text-center"
            >
              Manage Emergency Contacts
            </button>
          </div>

          {/* Card 2: Security & Biometrics */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Security &amp; Biometrics</h3>
              <p className="text-[11px] text-slate-500">Hardware tokens and device keys</p>
            </div>

            <div className="space-y-3 text-xs">
              {/* Token */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4 text-blue-700" />
                  <div>
                    <div className="font-bold text-slate-900">Dynamic Pass Token</div>
                    <div className="text-[11px] text-slate-500">Rotates every 30s • AES-256</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ACTIVE &amp; SYNCED
                </span>
              </div>

              {/* 2FA */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-blue-700" />
                  <div>
                    <div className="font-bold text-slate-900">2FA Authentication</div>
                    <div className="text-[11px] text-slate-500">Campus Duo Mobile Push (iOS 16.2)</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  VERIFIED
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAction("Reset security passphrase wizard launched.")}
              className="w-full text-center text-xs font-bold text-blue-700 hover:text-blue-900 py-1 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Security Passphrase</span>
            </button>
          </div>

          {/* Card 3: Directives & Privacy */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Directives &amp; Privacy</h3>
              <p className="text-[11px] text-slate-500">FERPA Compliance and Safety Telemetry</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">Safe Walk Tracking Consent</div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Share precise GPS with campus safety escorts when a Safe Walk dispatch is initiated.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => togglePrivacy("safeWalkGps")}
                  className={`w-10 h-5 rounded-full p-0.5 transition cursor-pointer shrink-0 ${
                    privacy.safeWalkGps ? "bg-[#0a2f77]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      privacy.safeWalkGps ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-start justify-between gap-3 pt-2 border-t border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">Incident Report Attribution</div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Attach your verified badge ID to submitted campus hazard reports for faster verification.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => togglePrivacy("reportAttribution")}
                  className={`w-10 h-5 rounded-full p-0.5 transition cursor-pointer shrink-0 ${
                    privacy.reportAttribution ? "bg-[#0a2f77]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      privacy.reportAttribution ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>
            </div>

            {/* FERPA Compliance Box */}
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>FERPA &amp; STUDENT PRIVACY CERTIFIED</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Personal telemetry protected under U.S. Ed §1232g standards
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
