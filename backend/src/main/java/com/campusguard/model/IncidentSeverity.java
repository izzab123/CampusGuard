package com.campusguard.model;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Domain classification for Incident Severity levels and automated notification routing.
 * Defines recipient roles for each severity level without hardcoding routing logic in controllers.
 */
public enum IncidentSeverity {

    MINOR(Set.of(IncidentSeverity.ROLE_SHIFT_SUPERVISOR)),
    MEDIUM(Set.of(IncidentSeverity.ROLE_SHIFT_SUPERVISOR, IncidentSeverity.ROLE_ADMIN)),
    MAJOR(Set.of(IncidentSeverity.ROLE_SHIFT_SUPERVISOR, IncidentSeverity.ROLE_ADMIN, IncidentSeverity.ROLE_PROCTOR));

    public static final String ROLE_SHIFT_SUPERVISOR = "Shift Supervisor";
    public static final String ROLE_ADMIN = "Admin";
    public static final String ROLE_PROCTOR = "Proctor and DSW";

    private final Set<String> notificationRoles;

    IncidentSeverity(Set<String> notificationRoles) {
        this.notificationRoles = Collections.unmodifiableSet(new LinkedHashSet<>(notificationRoles));
    }

    /**
     * Set of authority roles that should receive real-time notifications for this incident severity.
     */
    public Set<String> getNotificationRoles() {
        return notificationRoles;
    }

    /**
     * Resolves raw severity strings into the appropriate classified IncidentSeverity tier.
     * Supports canonical names (MINOR, MEDIUM, MAJOR) as well as existing tier names (LOW, HIGH, CRITICAL).
     */
    public static IncidentSeverity fromString(String rawSeverity) {
        if (rawSeverity == null || rawSeverity.isBlank()) {
            return MEDIUM;
        }

        String normalized = rawSeverity.trim().toUpperCase();
        switch (normalized) {
            case "LOW":
            case "MINOR":
                return MINOR;
            case "HIGH":
            case "MAJOR":
            case "CRITICAL":
                return MAJOR;
            case "MEDIUM":
            case "MODERATE":
            default:
                return MEDIUM;
        }
    }
}
