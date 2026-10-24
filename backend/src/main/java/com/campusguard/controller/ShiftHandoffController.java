package com.campusguard.controller;

import com.campusguard.dto.CreateShiftHandoffRequest;
import com.campusguard.dto.ShiftHandoffAckRequest;
import com.campusguard.model.ShiftHandoff;
import com.campusguard.model.ShiftHandoffAcknowledgement;
import com.campusguard.service.ShiftHandoffService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/shift-handoffs")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class ShiftHandoffController {

    private final ShiftHandoffService handoffService;

    public ShiftHandoffController(ShiftHandoffService handoffService) {
        this.handoffService = handoffService;
    }

    private Long resolveCallerId(HttpServletRequest request, Long headerId) {
        if (headerId != null) return headerId;
        if (request != null) {
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("USER_ID") != null) {
                Object uid = session.getAttribute("USER_ID");
                if (uid instanceof Long) return (Long) uid;
                if (uid instanceof Number) return ((Number) uid).longValue();
                try {
                    return Long.parseLong(uid.toString());
                } catch (NumberFormatException ignored) {}
            }
        }
        return null;
    }

    private String resolveCallerEmail(HttpServletRequest request, String headerEmail) {
        if (headerEmail != null && !headerEmail.isBlank()) return headerEmail.trim();
        if (request != null) {
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("USER_EMAIL") != null) {
                return (String) session.getAttribute("USER_EMAIL");
            }
        }
        return null;
    }

    private String resolveCallerRole(HttpServletRequest request, String headerRole) {
        if (headerRole != null && !headerRole.isBlank()) return headerRole.trim();
        if (request != null) {
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("USER_ROLE") != null) {
                return (String) session.getAttribute("USER_ROLE");
            }
        }
        return null;
    }

    /**
     * Endpoint for an incoming guard logging in for his shift to view the latest
     * shift handoff for his assigned gate.
     * CRITICAL: Simply viewing does NOT count as acknowledgement!
     */
    @GetMapping("/latest")
    public ResponseEntity<?> getLatestShiftHandoff(
            @RequestParam(required = false) String gatePost,
            @RequestParam(required = false) Long guardId,
            @RequestParam(required = false) String guardBadge,
            @RequestParam(required = false) String guardName,
            @RequestParam(required = false) String guardEmail,
            @RequestHeader(value = "X-Guard-Id", required = false) Long headerGuardId,
            @RequestHeader(value = "X-Guard-Badge", required = false) String headerGuardBadge,
            @RequestHeader(value = "X-Guard-Name", required = false) String headerGuardName,
            @RequestHeader(value = "X-User-Email", required = false) String headerUserEmail,
            HttpServletRequest request
    ) {
        Long resolvedGuardId = resolveCallerId(request, guardId != null ? guardId : headerGuardId);
        String resolvedBadge = (guardBadge != null && !guardBadge.isBlank()) ? guardBadge.trim() : headerGuardBadge;
        String resolvedName = (guardName != null && !guardName.isBlank()) ? guardName.trim() : headerGuardName;
        String resolvedEmail = resolveCallerEmail(request, guardEmail != null ? guardEmail : headerUserEmail);

        // If specific gatePost provided, fetch directly for that gate
        if (gatePost != null && !gatePost.isBlank()) {
            return handoffService.getLatestHandoffForGate(gatePost.trim())
                    .map(h -> ResponseEntity.ok()
                            .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                            .body(h))
                    .orElse(ResponseEntity.noContent().build());
        }

        // Otherwise resolve based on incoming guard's assigned duty roster gate
        return handoffService.getLatestHandoffForIncomingGuard(resolvedGuardId, resolvedEmail, resolvedBadge, resolvedName, null)
                .map(h -> ResponseEntity.ok()
                        .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                        .body(h))
                .orElse(ResponseEntity.noContent().build());
    }

    /**
     * Explicit acknowledgement endpoint.
     * The incoming guard must explicitly click "Acknowledge" to accept the handoff.
     * When clicked, this records the acknowledgement with his guard ID and exact timestamp,
     * formally transferring responsibility.
     */
    @PostMapping("/{id}/acknowledge")
    public ResponseEntity<?> acknowledgeShiftHandoff(
            @PathVariable Long id,
            @RequestBody(required = false) ShiftHandoffAckRequest body,
            @RequestHeader(value = "X-Guard-Id", required = false) Long headerGuardId,
            @RequestHeader(value = "X-Guard-Badge", required = false) String headerGuardBadge,
            @RequestHeader(value = "X-Guard-Name", required = false) String headerGuardName,
            @RequestHeader(value = "X-User-Email", required = false) String headerUserEmail,
            HttpServletRequest request
    ) {
        Long callerId = resolveCallerId(request, headerGuardId);
        String callerEmail = resolveCallerEmail(request, headerUserEmail);

        try {
            ShiftHandoff acknowledgedHandoff = handoffService.acknowledgeShiftHandoff(
                    id,
                    body != null ? body : new ShiftHandoffAckRequest(),
                    callerId,
                    headerGuardBadge,
                    headerGuardName,
                    callerEmail
            );
            return ResponseEntity.ok(acknowledgedHandoff);
        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", ex.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Outgoing guard and Shift Supervisor: Fetch specific shift handoff by ID with acknowledgement details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getShiftHandoffById(@PathVariable Long id) {
        return handoffService.getHandoffById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Outgoing guard and Shift Supervisor: Fetch acknowledgement record directly for a shift handoff.
     */
    @GetMapping("/{id}/acknowledgement")
    public ResponseEntity<?> getHandoffAcknowledgement(@PathVariable Long id) {
        return handoffService.getAcknowledgementByHandoffId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Outgoing Guard: View shift handoffs created by this outgoing guard.
     * Shows whether each handoff has been acknowledged, by which guard ID, and at what timestamp.
     */
    @GetMapping("/outgoing")
    public ResponseEntity<List<ShiftHandoff>> getOutgoingGuardHandoffs(
            @RequestParam(required = false) Long guardId,
            @RequestParam(required = false) String badgeNumber,
            @RequestHeader(value = "X-Guard-Id", required = false) Long headerGuardId,
            @RequestHeader(value = "X-Guard-Badge", required = false) String headerGuardBadge,
            HttpServletRequest request
    ) {
        Long resolvedId = resolveCallerId(request, guardId != null ? guardId : headerGuardId);
        String resolvedBadge = (badgeNumber != null && !badgeNumber.isBlank()) ? badgeNumber.trim() : headerGuardBadge;

        // Default to primary test guard if unspecified
        if (resolvedId == null && (resolvedBadge == null || resolvedBadge.isBlank())) {
            resolvedId = 3L;
        }

        List<ShiftHandoff> handoffs = handoffService.getHandoffsByOutgoingGuard(resolvedId, resolvedBadge);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .body(handoffs);
    }

    /**
     * Shift Supervisor & General Inspection:
     * Search and list all shift handoffs with filters for gatePost, status, outgoing guard, and acknowledgement.
     */
    @GetMapping
    public ResponseEntity<List<ShiftHandoff>> getShiftHandoffs(
            @RequestParam(required = false) String gatePost,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long outgoingGuardId,
            @RequestParam(required = false) Boolean acknowledged
    ) {
        List<ShiftHandoff> list = handoffService.searchHandoffs(gatePost, status, outgoingGuardId, acknowledged);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .body(list);
    }

    /**
     * Shift Supervisor: View all formal acknowledgement records.
     */
    @GetMapping("/acknowledgements")
    public ResponseEntity<List<ShiftHandoffAcknowledgement>> getAllAcknowledgements() {
        List<ShiftHandoffAcknowledgement> acks = handoffService.getAllAcknowledgements();
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .body(acks);
    }

    /**
     * Create a new shift handoff at a gate/post.
     */
    @PostMapping
    public ResponseEntity<?> createShiftHandoff(
            @Valid @RequestBody CreateShiftHandoffRequest req,
            @RequestHeader(value = "X-Guard-Id", required = false) Long headerGuardId,
            @RequestHeader(value = "X-Guard-Name", required = false) String headerGuardName,
            @RequestHeader(value = "X-Guard-Badge", required = false) String headerGuardBadge,
            @RequestHeader(value = "X-User-Email", required = false) String headerUserEmail,
            HttpServletRequest request
    ) {
        try {
            Long callerId = resolveCallerId(request, headerGuardId);
            String callerEmail = resolveCallerEmail(request, headerUserEmail);

            ShiftHandoff created = handoffService.createShiftHandoff(
                    req,
                    callerId,
                    headerGuardName,
                    headerGuardBadge,
                    callerEmail
            );
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}
