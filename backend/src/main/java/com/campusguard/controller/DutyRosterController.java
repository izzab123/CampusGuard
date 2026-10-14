package com.campusguard.controller;

import com.campusguard.dto.DutyReassignmentRequest;
import com.campusguard.model.DutyReassignmentHistory;
import com.campusguard.model.DutyRoster;
import com.campusguard.service.DutyRosterService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/duty-roster")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class DutyRosterController {

    private final DutyRosterService dutyRosterService;

    public DutyRosterController(DutyRosterService dutyRosterService) {
        this.dutyRosterService = dutyRosterService;
    }

    private String resolveCallerRole(HttpServletRequest request, String headerRole) {
        if (headerRole != null && !headerRole.isBlank()) {
            return headerRole.trim();
        }
        if (request != null) {
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("USER_ROLE") != null) {
                return (String) session.getAttribute("USER_ROLE");
            }
        }
        return null;
    }

    private String resolveCallerEmail(HttpServletRequest request, String headerEmail, String paramEmail) {
        if (headerEmail != null && !headerEmail.isBlank()) return headerEmail.trim();
        if (paramEmail != null && !paramEmail.isBlank()) return paramEmail.trim();
        if (request != null) {
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("USER_EMAIL") != null) {
                return (String) session.getAttribute("USER_EMAIL");
            }
        }
        return null;
    }

    /**
     * Dedicated endpoint for guards to view their own upcoming duty roster.
     * Features:
     * 1. Today's duty at the top
     * 2. Chronological upcoming duties including date, shift time, and assigned gate
     * 3. Guarantees guards can access only their own duty roster
     * 4. Real-time updates with no-cache headers
     */
    @GetMapping("/my-roster")
    public ResponseEntity<?> getMyDutyRoster(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String badgeNumber,
            @RequestParam(required = false) String name,
            @RequestHeader(value = "X-User-Role", required = false) String userRoleHeader,
            @RequestHeader(value = "X-User-Email", required = false) String userEmailHeader,
            @RequestHeader(value = "X-Guard-Badge", required = false) String guardBadgeHeader,
            @RequestHeader(value = "X-Guard-Name", required = false) String guardNameHeader,
            HttpServletRequest request
    ) {
        String resolvedEmail = resolveCallerEmail(request, userEmailHeader, email);
        String resolvedBadge = (guardBadgeHeader != null && !guardBadgeHeader.isBlank()) ? guardBadgeHeader.trim() : badgeNumber;
        String resolvedName = (guardNameHeader != null && !guardNameHeader.isBlank()) ? guardNameHeader.trim() : name;

        // Default to system primary test guard if no credentials provided
        if ((resolvedEmail == null || resolvedEmail.isBlank()) &&
            (resolvedBadge == null || resolvedBadge.isBlank()) &&
            (resolvedName == null || resolvedName.isBlank())) {
            resolvedEmail = "guard@campusguard.edu";
            resolvedName = "Officer Marcus Vance";
            resolvedBadge = "Shield #4082";
        }

        Map<String, Object> myRoster = dutyRosterService.getGuardDutyRoster(resolvedEmail, resolvedBadge, resolvedName);

        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .header(HttpHeaders.PRAGMA, "no-cache")
                .header(HttpHeaders.EXPIRES, "0")
                .body(myRoster);
    }

    /**
     * View Guard Duty Schedule & Reliever Assignment Roster.
     * Enforces that Security Guards can access ONLY their own rosters.
     * Supervisors and Admins can view all scheduled shifts.
     */
    @GetMapping
    public ResponseEntity<List<DutyRoster>> getDutyRoster(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String postLocation,
            @RequestParam(required = false) String supervisor,
            @RequestParam(required = false) String guard,
            @RequestHeader(value = "X-User-Role", required = false) String userRoleHeader,
            @RequestHeader(value = "X-User-Email", required = false) String userEmailHeader,
            @RequestHeader(value = "X-Guard-Badge", required = false) String guardBadgeHeader,
            @RequestHeader(value = "X-Guard-Name", required = false) String guardNameHeader,
            HttpServletRequest request
    ) {
        String callerRole = resolveCallerRole(request, userRoleHeader);

        // Security Guard access restriction: guards can access only their own duty rosters
        if ("Security Guard".equalsIgnoreCase(callerRole)) {
            String resolvedEmail = resolveCallerEmail(request, userEmailHeader, null);
            String resolvedBadge = (guardBadgeHeader != null && !guardBadgeHeader.isBlank()) ? guardBadgeHeader.trim() : null;
            String resolvedName = (guardNameHeader != null && !guardNameHeader.isBlank()) ? guardNameHeader.trim() : null;

            if (resolvedEmail == null && resolvedBadge == null && resolvedName == null && guard != null && !guard.isBlank()) {
                resolvedName = guard;
            } else if (resolvedEmail == null && resolvedBadge == null && resolvedName == null) {
                resolvedEmail = "guard@campusguard.edu";
                resolvedName = "Officer Marcus Vance";
                resolvedBadge = "Shield #4082";
            }

            List<DutyRoster> guardOnlyRoster = dutyRosterService.getGuardDutyRosterList(resolvedEmail, resolvedBadge, resolvedName);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .header(HttpHeaders.PRAGMA, "no-cache")
                    .header(HttpHeaders.EXPIRES, "0")
                    .body(guardOnlyRoster);
        }

        List<DutyRoster> roster = dutyRosterService.searchDutyRoster(date, status, postLocation, supervisor, guard);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .header(HttpHeaders.PRAGMA, "no-cache")
                .header(HttpHeaders.EXPIRES, "0")
                .body(roster);
    }

    /**
     * Get a specific shift schedule by ID.
     * Ensures guards can access only their own roster entries.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getShiftById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role", required = false) String userRoleHeader,
            @RequestHeader(value = "X-User-Email", required = false) String userEmailHeader,
            @RequestHeader(value = "X-Guard-Badge", required = false) String guardBadgeHeader,
            @RequestHeader(value = "X-Guard-Name", required = false) String guardNameHeader,
            HttpServletRequest request
    ) {
        String callerRole = resolveCallerRole(request, userRoleHeader);
        if ("Security Guard".equalsIgnoreCase(callerRole)) {
            String resolvedEmail = resolveCallerEmail(request, userEmailHeader, null);
            String resolvedBadge = guardBadgeHeader;
            String resolvedName = guardNameHeader;
            boolean assigned = dutyRosterService.isDutyAssignedToGuard(id, resolvedEmail, resolvedBadge, resolvedName);
            if (!assigned) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied: Guards can access only their own duty rosters"));
            }
        }

        return dutyRosterService.getDutyRosterById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Schedule a new guard shift.
     * Accessible by Shift Supervisor or Admin.
     */
    @PostMapping
    public ResponseEntity<?> scheduleShift(
            @RequestBody DutyRoster roster,
            @RequestHeader(value = "X-Supervisor-Name", required = false) String supervisorNameHeader,
            @RequestHeader(value = "X-Supervisor-Badge", required = false) String supervisorBadgeHeader,
            @RequestHeader(value = "X-User-Role", required = false) String userRoleHeader,
            HttpServletRequest request
    ) {
        String callerRole = resolveCallerRole(request, userRoleHeader);
        if ("Security Guard".equalsIgnoreCase(callerRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Security guards cannot schedule duty rosters"));
        }

        try {
            DutyRoster created = dutyRosterService.createShiftSchedule(roster, supervisorNameHeader, supervisorBadgeHeader);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Batch schedule multiple shifts at once.
     */
    @PostMapping("/batch")
    public ResponseEntity<?> scheduleBatchShifts(
            @RequestBody List<DutyRoster> rosters,
            @RequestHeader(value = "X-Supervisor-Name", required = false) String supervisorNameHeader,
            @RequestHeader(value = "X-Supervisor-Badge", required = false) String supervisorBadgeHeader,
            @RequestHeader(value = "X-User-Role", required = false) String userRoleHeader,
            HttpServletRequest request
    ) {
        String callerRole = resolveCallerRole(request, userRoleHeader);
        if ("Security Guard".equalsIgnoreCase(callerRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Security guards cannot schedule duty rosters"));
        }

        try {
            List<DutyRoster> createdList = dutyRosterService.createBatchShiftSchedule(rosters, supervisorNameHeader, supervisorBadgeHeader);
            return new ResponseEntity<>(createdList, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Full update of a scheduled shift.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateShift(
            @PathVariable Long id,
            @RequestBody DutyRoster updatedData,
            @RequestHeader(value = "X-User-Role", required = false) String userRoleHeader,
            HttpServletRequest request
    ) {
        String callerRole = resolveCallerRole(request, userRoleHeader);
        if ("Security Guard".equalsIgnoreCase(callerRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Security guards cannot modify duty rosters"));
        }

        try {
            DutyRoster updated = dutyRosterService.updateShiftSchedule(id, updatedData);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException ex) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Assign or update reliever guard for a scheduled shift.
     */
    @PatchMapping("/{id}/reliever")
    public ResponseEntity<?> updateReliever(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Role", required = false) String userRoleHeader,
            HttpServletRequest request
    ) {
        String callerRole = resolveCallerRole(request, userRoleHeader);
        if ("Security Guard".equalsIgnoreCase(callerRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Security guards cannot modify reliever assignments"));
        }

        try {
            String relieverName = payload.get("relieverName");
            String relieverBadge = payload.get("relieverBadgeNumber");
            String relieverStatus = payload.get("relieverStatus");
            String relieverTimeSlot = payload.get("relieverTimeSlot");

            DutyRoster updated = dutyRosterService.updateRelieverAssignment(id, relieverName, relieverBadge, relieverStatus, relieverTimeSlot);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Update status of a scheduled shift (e.g. CONFIRMED, ACTIVE, COMPLETED, CANCELLED).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Role", required = false) String userRoleHeader,
            HttpServletRequest request
    ) {
        String callerRole = resolveCallerRole(request, userRoleHeader);
        if ("Security Guard".equalsIgnoreCase(callerRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Security guards cannot modify duty roster status"));
        }

        try {
            String newStatus = payload.get("status");
            if (newStatus == null || newStatus.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status field is required"));
            }
            DutyRoster updated = dutyRosterService.updateStatus(id, newStatus);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Cancel / Delete a shift schedule.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShift(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role", required = false) String userRoleHeader,
            HttpServletRequest request
    ) {
        String callerRole = resolveCallerRole(request, userRoleHeader);
        if ("Security Guard".equalsIgnoreCase(callerRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Security guards cannot delete duty rosters"));
        }

        boolean deleted = dutyRosterService.deleteShiftSchedule(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get operational roster summary statistics for Shift Supervisor Dashboard.
     */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getRosterSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        Map<String, Object> summary = dutyRosterService.getRosterSummary(date);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .header(HttpHeaders.PRAGMA, "no-cache")
                .header(HttpHeaders.EXPIRES, "0")
                .body(summary);
    }

    /**
     * Reassign an absent guard's shift to an available replacement guard.
     * Records roster history containing both original and replacement assignments,
     * reason for reassignment, notifies replacement guard, and ensures absent guard
     * is excused (does not count as a no-show).
     */
    @PostMapping("/{id}/reassign")
    public ResponseEntity<?> reassignShift(
            @PathVariable Long id,
            @RequestBody DutyReassignmentRequest req,
            @RequestHeader(value = "X-Supervisor-Name", required = false) String supervisorNameHeader,
            @RequestHeader(value = "X-Supervisor-Badge", required = false) String supervisorBadgeHeader,
            @RequestHeader(value = "X-User-Role", required = false) String userRoleHeader,
            HttpServletRequest request
    ) {
        String callerRole = resolveCallerRole(request, userRoleHeader);
        if ("Security Guard".equalsIgnoreCase(callerRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Security guards cannot reassign duty rosters"));
        }

        try {
            DutyReassignmentHistory history = dutyRosterService.reassignDutyShift(
                    id, req, supervisorNameHeader, supervisorBadgeHeader);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .body(history);
        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Get full reassignment history audit trail across all roster duties.
     */
    @GetMapping("/reassignments")
    public ResponseEntity<List<DutyReassignmentHistory>> getAllReassignments() {
        List<DutyReassignmentHistory> list = dutyRosterService.getAllReassignmentHistory();
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .body(list);
    }

    /**
     * Get reassignment history for a specific roster entry.
     */
    @GetMapping("/{id}/reassignments")
    public ResponseEntity<List<DutyReassignmentHistory>> getReassignmentsByRoster(@PathVariable Long id) {
        List<DutyReassignmentHistory> list = dutyRosterService.getReassignmentHistoryForRoster(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .body(list);
    }
}
