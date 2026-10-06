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
  },
  features: `${getApiUrl()}/api/features`,
  status: `${getApiUrl()}/api/status`,
};
