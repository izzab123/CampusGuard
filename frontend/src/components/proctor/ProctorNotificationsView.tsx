"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Gavel
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  category: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
}

export default function ProctorNotificationsView() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.notifications.byRole("Proctor and DSW"));
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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
    if (activeTab === "Critical" && n.priority !== "CRITICAL" && n.priority !== "HIGH") return false;
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

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-purple-700 uppercase flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            <span>PROCTORIAL ALERT DISPATCH</span>
            <span className="text-slate-300">•</span>
            <span>DISCIPLINARY TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Proctor &amp; Welfare Notifications
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5 leading-relaxed">
            Automatic hazard escalations, high-priority police dispatch alerts, and student welfare advisories.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchNotifications}
          className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer self-start"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh</span>
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2">
        {["All", "Unread", "Critical"].map((tab) => {
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
                !item.isRead ? "border-purple-300 bg-purple-50/20" : "border-slate-200"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.priority === "HIGH" || item.priority === "CRITICAL"
                        ? "bg-red-100 text-red-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {item.priority}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{item.title}</span>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {item.message}
                </p>
                <div className="text-[11px] text-slate-400 font-medium">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>

              {!item.isRead && (
                <button
                  type="button"
                  onClick={() => handleMarkAsRead(item.id)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer self-start shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
