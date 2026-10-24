package com.campusguard.controller;

import com.campusguard.dto.LogbookEntryResponse;
import com.campusguard.model.ShiftHandoff;
import com.campusguard.service.ShiftHandoffService;
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
@RequestMapping({"/api/supervisor/logbook", "/api/shift-handoffs/logbook"})
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class SupervisorLogbookController {

    private final ShiftHandoffService handoffService;

    public SupervisorLogbookController(ShiftHandoffService handoffService) {
        this.handoffService = handoffService;
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

    private boolean isAuthorizedSupervisor(String role) {
        if (role == null || role.isBlank()) {
            return true; // default permit for dev / internal calls unless restricted role is provided
        }
        String normalized = role.trim().toUpperCase().replace("ROLE_", "").replace("_", " ");
        return normalized.equals("SHIFT SUPERVISOR") ||
               normalized.equals("SUPERVISOR") ||
               normalized.equals("ADMIN") ||
               normalized.equals("ADMINISTRATOR");
    }

    /**
     * View history list of logbook entries.
     * Shows date, shift, gate, outgoing guard, incoming guard, and acknowledgement status.
     * Allows filtering by:
     * - Date range: startDate (or fromDate) and endDate (or toDate)
     * - Guard: matches outgoing or incoming guard name or badge
     * - Gate: matches gatePost / postLocation
     * All entries are strictly read-only.
     */
    @GetMapping
    public ResponseEntity<?> getLogbookHistory(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) String guard,
            @RequestParam(required = false) String gate,
            @RequestParam(required = false) String status,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            HttpServletRequest request
    ) {
        String callerRole = resolveCallerRole(request, roleHeader);
        if (callerRole != null && !isAuthorizedSupervisor(callerRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Shift Supervisor or Administrator role required to view logbook history."));
        }

        LocalDate effectiveStart = startDate != null ? startDate : fromDate;
        LocalDate effectiveEnd = endDate != null ? endDate : toDate;

        List<LogbookEntryResponse> history = handoffService.searchLogbookEntries(
                effectiveStart,
                effectiveEnd,
                guard,
                gate,
                status
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .body(history);
    }

    /**
     * When the supervisor clicks to open an entry, return the full handoff details.
     * Strictly read-only for supervisors.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getLogbookEntryDetails(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            HttpServletRequest request
    ) {
        String callerRole = resolveCallerRole(request, roleHeader);
        if (callerRole != null && !isAuthorizedSupervisor(callerRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Shift Supervisor or Administrator role required to view logbook details."));
        }

        try {
            ShiftHandoff details = handoffService.getLogbookEntryDetails(id);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .body(details);
        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Logbook entry not found with ID: " + id));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    // =========================================================================
    // STRICT READ-ONLY ENFORCEMENT FOR SUPERVISORS
    // Ensures all logbook entries are strictly read-only so no modifications can be made.
    // =========================================================================

    @PutMapping(value = {"", "/**"})
    public ResponseEntity<?> rejectPutModification() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "error", "Logbook entries are strictly read-only for supervisors. Modifications are prohibited.",
                        "readOnly", true
                ));
    }

    @PatchMapping(value = {"", "/**"})
    public ResponseEntity<?> rejectPatchModification() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "error", "Logbook entries are strictly read-only for supervisors. Modifications are prohibited.",
                        "readOnly", true
                ));
    }

    @DeleteMapping(value = {"", "/**"})
    public ResponseEntity<?> rejectDeleteModification() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "error", "Logbook entries are strictly read-only for supervisors. Deletions are prohibited.",
                        "readOnly", true
                ));
    }

    @PostMapping(value = {"/{id}/update", "/{id}/edit", "/{id}/modify", "/{id}/delete"})
    public ResponseEntity<?> rejectPostModification() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "error", "Logbook entries are strictly read-only for supervisors. Modifications are prohibited.",
                        "readOnly", true
                ));
    }
}
