package com.campusguard.controller;

import com.campusguard.model.OccurrenceRecord;
import com.campusguard.service.OccurrenceRegisterService;
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
@RequestMapping({"/api/supervisor/occurrence-register", "/api/occurrence-register"})
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class OccurrenceRegisterController {

    private final OccurrenceRegisterService registerService;

    public OccurrenceRegisterController(OccurrenceRegisterService registerService) {
        this.registerService = registerService;
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
            return true; // Default permit unless explicit non-supervisor role is supplied
        }
        String normalized = role.trim().toUpperCase().replace("ROLE_", "").replace("_", " ");
        return normalized.equals("SHIFT SUPERVISOR") ||
               normalized.equals("SUPERVISOR") ||
               normalized.equals("ADMIN") ||
               normalized.equals("ADMINISTRATOR");
    }

    /**
     * View official log of no-shows and notable events.
     * Displays: date, guard, shift, gate, and type of occurrence.
     * Filters: date range (startDate / endDate), guard, and type.
     */
    @GetMapping
    public ResponseEntity<?> getOccurrenceRegister(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(required = false) String guard,
            @RequestParam(required = false) String type,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            HttpServletRequest request
    ) {
        String callerRole = resolveCallerRole(request, roleHeader);
        if (callerRole != null && !isAuthorizedSupervisor(callerRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Shift Supervisor or Administrator role required to view the official occurrence register."));
        }

        LocalDate effectiveStart = startDate != null ? startDate : fromDate;
        LocalDate effectiveEnd = endDate != null ? endDate : toDate;

        List<OccurrenceRecord> list = registerService.searchOccurrences(
                effectiveStart,
                effectiveEnd,
                guard,
                type
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .body(list);
    }

    /**
     * Open an entry to view full details and existing remarks.
     * Strictly read-only for original entry contents.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOccurrenceDetails(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            HttpServletRequest request
    ) {
        String callerRole = resolveCallerRole(request, roleHeader);
        if (callerRole != null && !isAuthorizedSupervisor(callerRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Shift Supervisor clearance required to view occurrence details."));
        }

        try {
            OccurrenceRecord record = registerService.getOccurrenceDetails(id);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .body(record);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Occurrence register entry not found with ID: " + id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Append separate follow-up remarks / notes to an occurrence entry.
     * The original register entry remains untouched and immutable.
     */
    @PostMapping("/{id}/remarks")
    public ResponseEntity<?> appendFollowUpRemark(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Name", required = false) String nameHeader,
            @RequestHeader(value = "X-User-Badge", required = false) String badgeHeader,
            @RequestHeader(value = "X-User-Email", required = false) String emailHeader,
            HttpServletRequest request
    ) {
        String callerRole = resolveCallerRole(request, roleHeader);
        if (callerRole != null && !isAuthorizedSupervisor(callerRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Shift Supervisor role required to append follow-up remarks."));
        }

        String remarkText = body.get("remark");
        if (remarkText == null || remarkText.isBlank()) {
            remarkText = body.get("remarkText");
        }
        if (remarkText == null || remarkText.isBlank()) {
            remarkText = body.get("note");
        }
        if (remarkText == null || remarkText.isBlank()) {
            remarkText = body.get("notes");
        }

        if (remarkText == null || remarkText.trim().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Remark text is required and cannot be empty."));
        }

        String authorName = body.get("authorName");
        if (authorName == null || authorName.isBlank()) {
            authorName = nameHeader != null && !nameHeader.isBlank() ? nameHeader : "Supervisor Elena Rostova";
        }

        String authorBadge = body.get("authorBadge");
        if (authorBadge == null || authorBadge.isBlank()) {
            authorBadge = badgeHeader != null && !badgeHeader.isBlank() ? badgeHeader : "SS-104";
        }

        String authorRole = body.get("authorRole");
        if (authorRole == null || authorRole.isBlank()) {
            authorRole = callerRole != null ? callerRole : "Shift Supervisor";
        }

        String authorEmail = body.get("authorEmail");
        if (authorEmail == null || authorEmail.isBlank()) {
            authorEmail = emailHeader != null ? emailHeader : "supervisor@campusguard.edu";
        }

        try {
            OccurrenceRecord updated = registerService.appendRemark(
                    id,
                    authorName,
                    authorBadge,
                    authorRole,
                    authorEmail,
                    remarkText
            );
            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .body(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Occurrence record not found with ID: " + id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // =========================================================================
    // STRICT READ-ONLY ENFORCEMENT ON ORIGINAL REGISTER ENTRIES
    // Prevents direct edit or deletion of the original register entry.
    // =========================================================================

    @PutMapping(value = {"", "/**"})
    public ResponseEntity<?> rejectPutModification() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "error", "Original register entries are strictly read-only. Supervisors may only append separate follow-up remarks.",
                        "readOnly", true
                ));
    }

    @PatchMapping(value = {"", "/**"})
    public ResponseEntity<?> rejectPatchModification() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "error", "Original register entries are strictly read-only. Supervisors may only append separate follow-up remarks.",
                        "readOnly", true
                ));
    }

    @DeleteMapping(value = {"", "/**"})
    public ResponseEntity<?> rejectDeleteModification() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "error", "Original register entries are strictly read-only. Deletions are strictly prohibited.",
                        "readOnly", true
                ));
    }

    @PostMapping(value = {"/{id}/update", "/{id}/edit", "/{id}/modify", "/{id}/delete"})
    public ResponseEntity<?> rejectDirectPostModification() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "error", "Original register entries are strictly read-only. Supervisors may only append separate follow-up remarks.",
                        "readOnly", true
                ));
    }
}
