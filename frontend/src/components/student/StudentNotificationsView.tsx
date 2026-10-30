"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  Wrench,
  ShieldCheck,
  Megaphone,
  Key,
  Sliders,
  Search,
  CheckCircle2,
  Clock,
  PhoneCall,
  ShieldAlert,
  Building,
  Footprints,
  RotateCcw,
  ExternalLink,
  ThumbsUp,
  FileText,
  Bell,
  UserCheck
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";
import { getStoredAuthUser, saveAuthUser } from "@/lib/auth";
import IncidentDetailsModal from "@/components/incidents/IncidentDetailsModal";
import VehicleDetailsModal from "@/components/vehicles/VehicleDetailsModal";

interface NotificationItem {
  id: number;
  recipientRole: string;
  recipientEmail?: string;
  title: string;
  message: string;
  category: string;
  priority: string;
  incidentId?: number;
  vehicleRegistrationId?: number;
  profileRequestId?: number;
  isRead: boolean;
  createdAt: string;
}

export default function StudentNotificationsView() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNotifications = async (isManualClick = false) => {
    if (isManualClick) setIsRefreshing(true);
    try {
      const user = getStoredAuthUser();
      const res = await fetch(API_ENDPOINTS.notifications.byRole("Student", user?.email || undefined));
      if (res.ok) {
        const data = await res.json();
        const normalized = (Array.isArray(data) ? data : []).map((n: any) => ({
          ...n,
          isRead: Boolean(n.isRead ?? n.read ?? false),
        }));
        setNotifications(normalized);
        if (isManualClick) {
          setActionNotice(`Notification feed refreshed (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}).`);
          setTimeout(() => setActionNotice(null), 4000);
        }
      }

      if (user?.email) {
        fetch(`${API_ENDPOINTS.auth.profile}?email=${encodeURIComponent(user.email)}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => {
            if (data && (data.fullName !== user.fullName || data.profilePicture !== user.profilePicture || data.profileReviewStatus !== user.profileReviewStatus)) {
              saveAuthUser({
                ...user,
                fullName: data.fullName || user.fullName,
                name: data.fullName || user.name,
                department: data.department || user.department,
                profilePicture: data.profilePicture !== undefined ? data.profilePicture : user.profilePicture,
                profileReviewStatus: data.profileReviewStatus || user.profileReviewStatus,
              });
            }
          })
          .catch(() => {});
      }
    } catch {
      if (isManualClick) {
        setActionNotice("Unable to refresh notification feed. Please check backend connection.");
        setTimeout(() => setActionNotice(null), 4000);
      }
    } finally {
      if (isManualClick) {
        setTimeout(() => setIsRefreshing(false), 300);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleOpenIncident = (notif: NotificationItem) => {
    if (notif.incidentId) {
      setSelectedIncidentId(notif.incidentId);
      setIsModalOpen(true);
      if (!notif.isRead) {
        handleMarkAsRead(notif.id);
      }
    }
  };

  const handleOpenVehicle = (notif: NotificationItem) => {
    if (notif.vehicleRegistrationId) {
      setSelectedVehicleId(notif.vehicleRegistrationId);
      setIsVehicleModalOpen(true);
      if (!notif.isRead) {
        handleMarkAsRead(notif.id);
      }
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await fetch(API_ENDPOINTS.notifications.read(id), { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      handleAction("Notification marked as read.");
    } catch {}
  };

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "Unread" && n.isRead) return false;
    if (activeTab === "High Priority" && n.priority !== "HIGH" && n.priority !== "CRITICAL") return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
    }
    return true;
  });

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

      {/* TOP HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-blue-700" />
            <span>CAMPUS DISPATCH FEED</span>
            <span className="text-slate-300">•</span>
            <span>REAL-TIME BROADCASTS</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Safety Bulletins &amp; Clearance Notifications
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5 leading-relaxed">
            Direct telemetry alerts, gate passes, parking status changes, and campus security bulletins.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchNotifications(true)}
          disabled={isRefreshing}
          className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-60 self-start"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Feed"}</span>
        </button>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-wrap items-center gap-2">
        {["All", "Unread", "High Priority"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? "bg-[#0a2f77] text-white font-bold shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab} ({tab === "All" ? notifications.length : tab === "Unread" ? notifications.filter(n => !n.isRead).length : notifications.filter(n => n.priority === "HIGH" || n.priority === "CRITICAL").length})
            </button>
          );
        })}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-400 text-xs">
            No notifications matching current filter.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs transition flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                !item.isRead ? "border-blue-300 bg-blue-50/20" : "border-slate-200"
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.priority === "HIGH" || item.priority === "CRITICAL"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.priority}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{item.title}</span>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                  {item.incidentId && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                      #INC-{item.incidentId}
                    </span>
                  )}
                  {item.vehicleRegistrationId && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      #VEH-{item.vehicleRegistrationId}
                    </span>
                  )}
                  {item.category === "PROFILE_UPDATE" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-300">
                      #PROFILE-UPDATE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {item.message}
                </p>
                <div className="text-[11px] text-slate-400 font-medium">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start shrink-0 flex-wrap">
                {item.category === "PROFILE_UPDATE" && (
                  <Link
                    href="/dashboard/student/profile"
                    className="px-3 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>View My Profile</span>
                  </Link>
                )}

                {item.incidentId && (
                  <button
                    type="button"
                    onClick={() => handleOpenIncident(item)}
                    className="px-3 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Incident Report</span>
                  </button>
                )}

                {item.vehicleRegistrationId && (
                  <button
                    type="button"
                    onClick={() => handleOpenVehicle(item)}
                    className="px-3 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>View Vehicle Details</span>
                  </button>
                )}

                {!item.isRead && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(item.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Incident Details Modal */}
      <IncidentDetailsModal
        isOpen={isModalOpen}
        incidentId={selectedIncidentId}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIncidentId(null);
        }}
      />

      {/* Vehicle Details Modal */}
      <VehicleDetailsModal
        isOpen={isVehicleModalOpen}
        vehicleId={selectedVehicleId}
        canApprove={false}
        onClose={() => {
          setIsVehicleModalOpen(false);
          setSelectedVehicleId(null);
        }}
      />
    </div>
  );
}
