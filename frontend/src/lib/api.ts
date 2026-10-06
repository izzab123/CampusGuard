/**
 * Centralized API configuration and utility helpers
 */

export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
};

export const API_ENDPOINTS = {
  auth: {
    login: `${getApiUrl()}/api/auth/login`,
    logout: `${getApiUrl()}/api/auth/logout`,
    forgotPassword: `${getApiUrl()}/api/auth/forgot-password`,
    resetPassword: `${getApiUrl()}/api/auth/reset-password`,
    validateToken: `${getApiUrl()}/api/auth/validate-token`,
    roles: `${getApiUrl()}/api/auth/roles`,
    users: `${getApiUrl()}/api/auth/users`,
    profile: `${getApiUrl()}/api/auth/profile`,
    toggleStatus: (id: number | string) => `${getApiUrl()}/api/auth/users/${id}/status`,
  },
  incidents: {
    base: `${getApiUrl()}/api/incidents`,
    list: `${getApiUrl()}/api/incidents`,
    resolve: (id: number | string) => `${getApiUrl()}/api/incidents/${id}/resolve`,
    status: (id: number | string) => `${getApiUrl()}/api/incidents/${id}/status`,
    escalate: (id: number | string) => `${getApiUrl()}/api/incidents/${id}/escalate`,
  },
  shifts: {
    base: `${getApiUrl()}/api/shifts`,
    list: `${getApiUrl()}/api/shifts`,
    checkIn: `${getApiUrl()}/api/shifts/check-in`,
    checkout: (id: number | string) => `${getApiUrl()}/api/shifts/${id}/checkout`,
    escalate: (id: number | string) => `${getApiUrl()}/api/shifts/${id}/escalate`,
  },
  parking: {
    passes: `${getApiUrl()}/api/parking/passes`,
    my: (owner?: string) => `${getApiUrl()}/api/parking/passes/my${owner ? `?owner=${encodeURIComponent(owner)}` : ""}`,
    verify: `${getApiUrl()}/api/parking/verify`,
  },
  auditLogs: {
    base: `${getApiUrl()}/api/audit-logs`,
    list: `${getApiUrl()}/api/audit-logs`,
    create: `${getApiUrl()}/api/audit-logs`,
  },
  notifications: {
    base: `${getApiUrl()}/api/notifications`,
    list: (role?: string) => role ? `${getApiUrl()}/api/notifications?role=${encodeURIComponent(role)}` : `${getApiUrl()}/api/notifications`,
    byRole: (role: string) => `${getApiUrl()}/api/notifications?role=${encodeURIComponent(role)}`,
    read: (id: number | string) => `${getApiUrl()}/api/notifications/${id}/read`,
    markRead: (id: number | string) => `${getApiUrl()}/api/notifications/${id}/read`,
  },
  features: `${getApiUrl()}/api/features`,
  status: `${getApiUrl()}/api/status`,
};
