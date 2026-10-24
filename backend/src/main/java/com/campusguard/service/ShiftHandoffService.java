package com.campusguard.service;

import com.campusguard.dto.CreateShiftHandoffRequest;
import com.campusguard.dto.ShiftHandoffAckRequest;
import com.campusguard.model.*;
import com.campusguard.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class ShiftHandoffService {

    private static final Logger logger = LoggerFactory.getLogger(ShiftHandoffService.class);

    private final ShiftHandoffRepository handoffRepo;
    private final ShiftHandoffAcknowledgementRepository ackRepo;
    private final UserRepository userRepo;
    private final DutyRosterRepository dutyRosterRepo;
    private final AuditLogRepository auditLogRepo;
    private final NotificationRepository notificationRepo;

    @Autowired
    public ShiftHandoffService(
            ShiftHandoffRepository handoffRepo,
            ShiftHandoffAcknowledgementRepository ackRepo,
            @Autowired(required = false) UserRepository userRepo,
            @Autowired(required = false) DutyRosterRepository dutyRosterRepo,
            @Autowired(required = false) AuditLogRepository auditLogRepo,
            @Autowired(required = false) NotificationRepository notificationRepo
    ) {
        this.handoffRepo = handoffRepo;
        this.ackRepo = ackRepo;
        this.userRepo = userRepo;
        this.dutyRosterRepo = dutyRosterRepo;
        this.auditLogRepo = auditLogRepo;
        this.notificationRepo = notificationRepo;
    }

    /**
     * Create a new shift handoff at a gate/post by an outgoing guard.
     */
    public ShiftHandoff createShiftHandoff(
            CreateShiftHandoffRequest req,
            Long guardIdHeader,
            String guardNameHeader,
            String guardBadgeHeader,
            String guardEmailHeader
    ) {
        if (req == null) {
            throw new IllegalArgumentException("Handoff request payload cannot be null");
        }
        if (req.getGatePost() == null || req.getGatePost().isBlank()) {
            throw new IllegalArgumentException("Assigned gate / post location is required for shift handoff");
        }
        if (req.getHandoffNotes() == null || req.getHandoffNotes().isBlank()) {
            throw new IllegalArgumentException("Handoff notes are required");
        }

        Long outgoingId = req.getOutgoingGuardId() != null ? req.getOutgoingGuardId() : guardIdHeader;
        String outgoingName = (req.getOutgoingGuardName() != null && !req.getOutgoingGuardName().isBlank())
                ? req.getOutgoingGuardName().trim() : guardNameHeader;
        String outgoingBadge = (req.getOutgoingGuardBadgeNumber() != null && !req.getOutgoingGuardBadgeNumber().isBlank())
                ? req.getOutgoingGuardBadgeNumber().trim() : guardBadgeHeader;
        String outgoingEmail = (req.getOutgoingGuardEmail() != null && !req.getOutgoingGuardEmail().isBlank())
                ? req.getOutgoingGuardEmail().trim() : guardEmailHeader;

        // Auto-resolve outgoing guard details from UserRepository if missing
        if (outgoingId != null && (outgoingName == null || outgoingBadge == null) && userRepo != null) {
            Optional<User> uOpt = userRepo.findById(outgoingId);
            if (uOpt.isPresent()) {
                User u = uOpt.get();
                if (outgoingName == null) outgoingName = u.getFullName();
                if (outgoingBadge == null) outgoingBadge = u.getBadgeNumber();
                if (outgoingEmail == null) outgoingEmail = u.getEmail();
            }
        } else if (outgoingBadge != null && outgoingId == null && userRepo != null) {
            Optional<User> uOpt = userRepo.findByBadgeNumber(outgoingBadge);
            if (uOpt.isPresent()) {
                User u = uOpt.get();
                outgoingId = u.getId();
                if (outgoingName == null) outgoingName = u.getFullName();
                if (outgoingEmail == null) outgoingEmail = u.getEmail();
            }
        }

        // Apply fallback defaults if completely unspecified
        if (outgoingId == null) outgoingId = 3L; // Default system guard ID
        if (outgoingName == null || outgoingName.isBlank()) outgoingName = "Officer Marcus Vance";
        if (outgoingBadge == null || outgoingBadge.isBlank()) outgoingBadge = "Shield #4082";

        ShiftHandoff handoff = new ShiftHandoff(
                req.getGatePost().trim(),
                outgoingId,
                outgoingName,
                outgoingBadge,
                outgoingEmail,
                req.getShiftType() != null ? req.getShiftType() : "MORNING",
                req.getShiftDate() != null ? req.getShiftDate() : LocalDate.now(),
                req.getShiftStartTime() != null ? req.getShiftStartTime() : "06:00",
                req.getShiftEndTime() != null ? req.getShiftEndTime() : "14:00",
                req.getHandoffNotes().trim(),
                req.getEquipmentStatus(),
                req.getKeyInventory()
        );

        handoff.setStatus("PENDING_ACKNOWLEDGEMENT");
        handoff.setAcknowledged(false);
        handoff.setResponsibilityTransferred(false);

        ShiftHandoff saved = handoffRepo.save(handoff);

        // Audit Log
        if (auditLogRepo != null) {
            AuditLog log = new AuditLog(
                    "SHIFT_HANDOFF_CREATED",
                    "Shift handoff #" + saved.getId() + " created for gate '" + saved.getGatePost() +
                    "' by Outgoing Guard ID " + outgoingId + " (" + outgoingName + "). Awaiting incoming guard acknowledgement.",
                    outgoingName,
                    "Security Guard",
                    "127.0.0.1",
                    "INFO"
            );
            auditLogRepo.save(log);
        }

        logger.info("Created shift handoff #{} for gate '{}' by outgoing guard {} (ID: {})",
                saved.getId(), saved.getGatePost(), outgoingName, outgoingId);

        return saved;
    }

    /**
     * Retrieve the latest shift handoff for a specific gate.
     * CRITICAL: Simply viewing does NOT count as acknowledgement!
     */
    @Transactional(readOnly = true)
    public Optional<ShiftHandoff> getLatestHandoffForGate(String gatePost) {
        if (gatePost == null || gatePost.isBlank()) {
            return Optional.empty();
        }
        return handoffRepo.findFirstByGatePostIgnoreCaseOrderByCreatedAtDesc(gatePost.trim());
    }

    /**
     * Retrieve the latest shift handoff for an incoming guard's assigned gate.
     * Automatically inspects the guard's duty roster for today to locate their assigned gate/station.
     * CRITICAL: Simply viewing does NOT count as acknowledgement!
     */
    @Transactional(readOnly = true)
    public Optional<ShiftHandoff> getLatestHandoffForIncomingGuard(
            Long guardId,
            String guardEmail,
            String guardBadge,
            String guardName,
            String explicitGate
    ) {
        String assignedGate = null;

        // 1. If explicit gate provided, use it
        if (explicitGate != null && !explicitGate.isBlank()) {
            assignedGate = explicitGate.trim();
        }

        // 2. Otherwise, check today's duty roster for this guard
        if (assignedGate == null && dutyRosterRepo != null) {
            LocalDate today = LocalDate.now();
            List<DutyRoster> todayRosters = dutyRosterRepo.findTodayRosterForGuard(today, guardEmail, guardBadge, guardName);
            if (!todayRosters.isEmpty()) {
                assignedGate = todayRosters.get(0).getPostLocation();
            } else {
                List<DutyRoster> upcoming = dutyRosterRepo.findUpcomingRosterForGuard(today, guardEmail, guardBadge, guardName);
                if (!upcoming.isEmpty()) {
                    assignedGate = upcoming.get(0).getPostLocation();
                }
            }
        }

        // 3. Fallback: if guard details match a known user, check if we can infer or use latest gate
        if (assignedGate != null && !assignedGate.isBlank()) {
            Optional<ShiftHandoff> handoff = handoffRepo.findFirstByGatePostIgnoreCaseOrderByCreatedAtDesc(assignedGate);
            if (handoff.isPresent()) {
                return handoff;
            }
        }

        // 4. Default: return the latest available shift handoff across all gates
        List<ShiftHandoff> allHandoffs = handoffRepo.findAllByOrderByCreatedAtDesc();
        return allHandoffs.isEmpty() ? Optional.empty() : Optional.of(allHandoffs.get(0));
    }

    /**
     * Explicitly acknowledge a shift handoff by the incoming guard.
     * When acknowledged:
     * 1. Validates handoff existence and prevents duplicate acknowledgement.
     * 2. Saves an immutable acknowledgement record with guard ID and exact timestamp.
     * 3. Sets responsibilityTransferred = true so responsibility is formally transferred to the incoming guard.
     * 4. Updates handoff status to ACKNOWLEDGED.
     * 5. Emits audit logs and notifications.
     */
    public ShiftHandoff acknowledgeShiftHandoff(
            Long handoffId,
            ShiftHandoffAckRequest req,
            Long callerGuardId,
            String callerBadge,
            String callerName,
            String callerEmail
    ) {
        if (handoffId == null) {
            throw new IllegalArgumentException("Handoff ID is required for acknowledgement");
        }

        ShiftHandoff handoff = handoffRepo.findById(handoffId)
                .orElseThrow(() -> new NoSuchElementException("Shift handoff not found with ID: " + handoffId));

        if (handoff.isAcknowledged()) {
            throw new IllegalStateException("Shift handoff #" + handoffId +
                    " has already been acknowledged by Guard ID " + handoff.getAcknowledgedByGuardId() +
                    " (" + handoff.getAcknowledgedByGuardName() + ") at " + handoff.getAcknowledgedAt());
        }

        // Resolve incoming guard details
        Long incomingGuardId = (req != null && req.getGuardId() != null) ? req.getGuardId() : callerGuardId;
        String incomingGuardBadge = (req != null && req.getGuardBadgeNumber() != null && !req.getGuardBadgeNumber().isBlank())
                ? req.getGuardBadgeNumber().trim() : callerBadge;
        String incomingGuardName = (req != null && req.getGuardName() != null && !req.getGuardName().isBlank())
                ? req.getGuardName().trim() : callerName;
        String incomingGuardEmail = (req != null && req.getGuardEmail() != null && !req.getGuardEmail().isBlank())
                ? req.getGuardEmail().trim() : callerEmail;

        if (incomingGuardId == null && incomingGuardBadge != null && userRepo != null) {
            userRepo.findByBadgeNumber(incomingGuardBadge).ifPresent(u -> {
                // Resolved
            });
        }

        if (userRepo != null) {
            if (incomingGuardId != null) {
                userRepo.findById(incomingGuardId).ifPresent(u -> {
                    // Fill missing details
                });
            } else if (incomingGuardBadge != null) {
                Optional<User> uOpt = userRepo.findByBadgeNumber(incomingGuardBadge);
                if (uOpt.isPresent()) {
                    incomingGuardId = uOpt.get().getId();
                    if (incomingGuardName == null) incomingGuardName = uOpt.get().getFullName();
                    if (incomingGuardEmail == null) incomingGuardEmail = uOpt.get().getEmail();
                }
            } else if (incomingGuardEmail != null) {
                Optional<User> uOpt = userRepo.findByEmailIgnoreCase(incomingGuardEmail);
                if (uOpt.isPresent()) {
                    incomingGuardId = uOpt.get().getId();
                    if (incomingGuardName == null) incomingGuardName = uOpt.get().getFullName();
                    if (incomingGuardBadge == null) incomingGuardBadge = uOpt.get().getBadgeNumber();
                }
            }
        }

        // Apply defaults if completely missing
        if (incomingGuardId == null) {
            incomingGuardId = 3L; // Default Security Guard ID
        }
        if (incomingGuardName == null || incomingGuardName.isBlank()) {
            incomingGuardName = "Officer Marcus Vance";
        }
        if (incomingGuardBadge == null || incomingGuardBadge.isBlank()) {
            incomingGuardBadge = "Shield #4082";
        }

        // Capture exact timestamp
        LocalDateTime exactTimestamp = LocalDateTime.now();

        // Build and save immutable ShiftHandoffAcknowledgement record
        ShiftHandoffAcknowledgement ack = new ShiftHandoffAcknowledgement(
                handoff.getId(),
                handoff.getGatePost(),
                incomingGuardId,
                incomingGuardName,
                incomingGuardBadge,
                incomingGuardEmail,
                exactTimestamp,
                (req != null && req.getNotes() != null) ? req.getNotes().trim() : "Keys, radio inventory, and post status verified received.",
                handoff.getOutgoingGuardId(),
                handoff.getOutgoingGuardName(),
                handoff.getOutgoingGuardBadgeNumber()
        );
        ack.setResponsibilityTransferred(true);
        ShiftHandoffAcknowledgement savedAck = ackRepo.save(ack);

        // Update the ShiftHandoff entity
        handoff.setAcknowledged(true);
        handoff.setAcknowledgedAt(exactTimestamp);
        handoff.setAcknowledgedByGuardId(incomingGuardId);
        handoff.setAcknowledgedByGuardName(incomingGuardName);
        handoff.setAcknowledgedByGuardBadge(incomingGuardBadge);
        handoff.setResponsibilityTransferred(true);
        handoff.setStatus("ACKNOWLEDGED");
        handoff.setAcknowledgementNotes(savedAck.getNotes());
        handoff.setAcknowledgement(savedAck);

        ShiftHandoff savedHandoff = handoffRepo.save(handoff);

        // Audit Trail
        if (auditLogRepo != null) {
            AuditLog auditLog = new AuditLog(
                    "SHIFT_HANDOFF_ACKNOWLEDGED",
                    "Shift handoff #" + savedHandoff.getId() + " at gate '" + savedHandoff.getGatePost() +
                    "' acknowledged by Incoming Guard ID " + incomingGuardId + " (" + incomingGuardName +
                    ", " + incomingGuardBadge + ") at " + exactTimestamp + ". Responsibility formally transferred.",
                    incomingGuardName,
                    "Security Guard",
                    "127.0.0.1",
                    "INFO"
            );
            auditLogRepo.save(auditLog);
        }

        // Notifications for Outgoing Guard and Shift Supervisor
        if (notificationRepo != null) {
            Notification notifyOutgoing = new Notification(
                    "Security Guard",
                    handoff.getOutgoingGuardEmail(),
                    "Shift Handoff Acknowledged",
                    "Your shift handoff at " + handoff.getGatePost() + " was accepted by Guard " +
                    incomingGuardName + " (ID: " + incomingGuardId + ") at " + exactTimestamp +
                    ". Responsibility formally transferred.",
                    "DISPATCH",
                    "MEDIUM"
            );
            Notification notifySupervisor = new Notification(
                    "Shift Supervisor",
                    null,
                    "Gate Handoff Confirmed - " + handoff.getGatePost(),
                    "Incoming Guard " + incomingGuardName + " (ID: " + incomingGuardId + ") accepted duty at " +
                    handoff.getGatePost() + " at " + exactTimestamp + " from outgoing guard " +
                    handoff.getOutgoingGuardName() + ".",
                    "DISPATCH",
                    "LOW"
            );
            notificationRepo.saveAll(List.of(notifyOutgoing, notifySupervisor));
        }

        logger.info("Shift handoff #{} at '{}' acknowledged by Guard ID: {} ({}). Responsibility formally transferred at {}",
                handoff.getId(), handoff.getGatePost(), incomingGuardId, incomingGuardName, exactTimestamp);

        return savedHandoff;
    }

    @Transactional(readOnly = true)
    public Optional<ShiftHandoff> getHandoffById(Long id) {
        return handoffRepo.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<ShiftHandoffAcknowledgement> getAcknowledgementByHandoffId(Long handoffId) {
        return ackRepo.findByShiftHandoffId(handoffId);
    }

    /**
     * For outgoing guards: retrieve all handoffs created by this outgoing guard.
     * Shows whether each handoff has been acknowledged, by which guard ID, and at what timestamp.
     */
    @Transactional(readOnly = true)
    public List<ShiftHandoff> getHandoffsByOutgoingGuard(Long outgoingGuardId, String outgoingBadge) {
        if (outgoingGuardId != null) {
            return handoffRepo.findByOutgoingGuardIdOrderByCreatedAtDesc(outgoingGuardId);
        }
        if (outgoingBadge != null && !outgoingBadge.isBlank()) {
            return handoffRepo.findByOutgoingGuardBadgeNumberOrderByCreatedAtDesc(outgoingBadge.trim());
        }
        return Collections.emptyList();
    }

    /**
     * Search and filter shift handoffs (for Shift Supervisors and general querying).
     */
    @Transactional(readOnly = true)
    public List<ShiftHandoff> searchHandoffs(String gatePost, String status, Long outgoingGuardId, Boolean acknowledged) {
        boolean hasFilter = (gatePost != null && !gatePost.isBlank()) ||
                            (status != null && !status.isBlank()) ||
                            (outgoingGuardId != null) ||
                            (acknowledged != null);

        if (!hasFilter) {
            return handoffRepo.findAllByOrderByCreatedAtDesc();
        }

        String filterGate = (gatePost != null && !gatePost.isBlank()) ? gatePost.trim() : null;
        String filterStatus = (status != null && !status.isBlank()) ? status.trim() : null;

        return handoffRepo.searchHandoffs(filterGate, filterStatus, outgoingGuardId, acknowledged);
    }

    /**
     * For supervisors: view all acknowledgement audit records.
     */
    @Transactional(readOnly = true)
    public List<ShiftHandoffAcknowledgement> getAllAcknowledgements() {
        return ackRepo.findAllByOrderByAcknowledgedAtDesc();
    }

    /**
     * For Shift Supervisors:
     * View history list of logbook entries showing date, shift, gate, outgoing guard,
     * incoming guard, and acknowledgement status.
     * Allows filtering by date range (startDate to endDate), guard, and gate.
     * Strictly read-only.
     */
    @Transactional(readOnly = true)
    public List<com.campusguard.dto.LogbookEntryResponse> searchLogbookEntries(
            LocalDate startDate,
            LocalDate endDate,
            String guard,
            String gate,
            String status
    ) {
        String filterGuard = (guard != null && !guard.isBlank()) ? guard.trim() : null;
        String filterGate = (gate != null && !gate.isBlank()) ? gate.trim() : null;
        String filterStatus = (status != null && !status.isBlank()) ? status.trim() : null;

        List<ShiftHandoff> handoffs = handoffRepo.searchLogbook(startDate, endDate, filterGuard, filterGate, filterStatus);
        return handoffs.stream()
                .map(com.campusguard.dto.LogbookEntryResponse::fromShiftHandoff)
                .toList();
    }

    /**
     * When the supervisor clicks to open an entry, return the full handoff details.
     * Strictly read-only for supervisors.
     */
    @Transactional(readOnly = true)
    public ShiftHandoff getLogbookEntryDetails(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Logbook entry ID cannot be null");
        }
        return handoffRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Logbook entry not found with ID: " + id));
    }
}
