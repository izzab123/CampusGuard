package com.campusguard.controller;

import com.campusguard.model.AuditLog;
import com.campusguard.model.ShiftHandoffForm;
import com.campusguard.repository.AuditLogRepository;
import com.campusguard.repository.ShiftHandoffFormRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/handoffs")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class ShiftHandoffFormController {

    private final ShiftHandoffFormRepository handoffRepo;
    private final AuditLogRepository auditLogRepo;

    public ShiftHandoffFormController(ShiftHandoffFormRepository handoffRepo, AuditLogRepository auditLogRepo) {
        this.handoffRepo = handoffRepo;
        this.auditLogRepo = auditLogRepo;
    }

    @GetMapping
    public ResponseEntity<List<ShiftHandoffForm>> getHandoffForms(
            @RequestParam(required = false) String guardId,
            @RequestParam(required = false) String postLocation
    ) {
        if (guardId != null && !guardId.isBlank()) {
            return ResponseEntity.ok(handoffRepo.findByOutgoingGuardIdOrderByTimestampDesc(guardId));
        }
        if (postLocation != null && !postLocation.isBlank()) {
            return ResponseEntity.ok(handoffRepo.findByPostLocationOrderByTimestampDesc(postLocation));
        }
        return ResponseEntity.ok(handoffRepo.findAllByOrderByTimestampDesc());
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestHandoff(
            @RequestParam(required = false) String postLocation
    ) {
        List<ShiftHandoffForm> forms = (postLocation != null && !postLocation.isBlank())
                ? handoffRepo.findByPostLocationOrderByTimestampDesc(postLocation)
                : handoffRepo.findAllByOrderByTimestampDesc();

        if (forms.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(forms.get(0));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShiftHandoffForm> getHandoffById(@PathVariable Long id) {
        return handoffRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createHandoffForm(
            @RequestBody ShiftHandoffForm form,
            @RequestHeader(value = "X-Guard-Id", required = false) String guardIdHeader,
            @RequestHeader(value = "X-Guard-Name", required = false) String guardNameHeader,
            @RequestHeader(value = "X-User-Email", required = false) String guardEmailHeader
    ) {
        // Resolve Outgoing Guard ID
        String outgoingId = form.getOutgoingGuardId();
        if (outgoingId == null || outgoingId.isBlank()) {
            outgoingId = guardIdHeader;
        }
        if (outgoingId == null || outgoingId.isBlank()) {
            outgoingId = guardEmailHeader;
        }
        if (outgoingId == null || outgoingId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Outgoing guard ID is required before submitting handoff."));
        }
        form.setOutgoingGuardId(outgoingId.trim());

        // Resolve Guard Name and Email
        if ((form.getOutgoingGuardName() == null || form.getOutgoingGuardName().isBlank()) && guardNameHeader != null) {
            form.setOutgoingGuardName(guardNameHeader.trim());
        }
        if ((form.getOutgoingGuardEmail() == null || form.getOutgoingGuardEmail().isBlank()) && guardEmailHeader != null) {
            form.setOutgoingGuardEmail(guardEmailHeader.trim());
        }

        // Validate Required Sections
        if (form.getIncidents() == null || form.getIncidents().trim().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Incidents section is required."));
        }
        if (form.getGeneralObservations() == null || form.getGeneralObservations().trim().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "General observations section is required."));
        }
        if (form.getPendingIssues() == null || form.getPendingIssues().trim().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Pending issues section is required."));
        }
        if (form.getItemsToWatch() == null || form.getItemsToWatch().trim().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Items to watch section is required."));
        }

        // Clean values
        form.setIncidents(form.getIncidents().trim());
        form.setGeneralObservations(form.getGeneralObservations().trim());
        form.setPendingIssues(form.getPendingIssues().trim());
        form.setItemsToWatch(form.getItemsToWatch().trim());

        if (form.getPostLocation() == null || form.getPostLocation().trim().isBlank()) {
            form.setPostLocation("General Campus Checkpoint");
        } else {
            form.setPostLocation(form.getPostLocation().trim());
        }

        // Save timestamp and persist
        form.setTimestamp(LocalDateTime.now());
        ShiftHandoffForm saved = handoffRepo.save(form);

        // Audit Log Entry
        try {
            String actor = (saved.getOutgoingGuardName() != null && !saved.getOutgoingGuardName().isBlank())
                    ? saved.getOutgoingGuardName() + " (" + saved.getOutgoingGuardId() + ")"
                    : saved.getOutgoingGuardId();
            AuditLog audit = new AuditLog(
                    "SHIFT_HANDOFF_SUBMITTED",
                    "Digital shift handoff form #" + saved.getId() + " submitted for " + saved.getPostLocation() + " by outgoing guard ID: " + saved.getOutgoingGuardId(),
                    actor,
                    "Security Guard",
                    "127.0.0.1",
                    "INFO"
            );
            auditLogRepo.save(audit);
        } catch (Exception ignored) {}

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
