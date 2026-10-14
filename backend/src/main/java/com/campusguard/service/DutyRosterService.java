package com.campusguard.service;

import com.campusguard.dto.DutyReassignmentRequest;
import com.campusguard.model.AuditLog;
import com.campusguard.model.DutyReassignmentHistory;
import com.campusguard.model.DutyRoster;
import com.campusguard.model.Notification;
import com.campusguard.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class DutyRosterService {

    private final DutyRosterRepository dutyRosterRepo;
    private final UserRepository userRepo;
    private final DutyReassignmentHistoryRepository reassignmentRepo;
    private final NotificationRepository notificationRepo;
    private final AuditLogRepository auditLogRepo;

    @Autowired
    public DutyRosterService(
            DutyRosterRepository dutyRosterRepo,
            @Autowired(required = false) UserRepository userRepo,
            @Autowired(required = false) DutyReassignmentHistoryRepository reassignmentRepo,
            @Autowired(required = false) NotificationRepository notificationRepo,
            @Autowired(required = false) AuditLogRepository auditLogRepo) {
        this.dutyRosterRepo = dutyRosterRepo;
        this.userRepo = userRepo;
        this.reassignmentRepo = reassignmentRepo;
        this.notificationRepo = notificationRepo;
        this.auditLogRepo = auditLogRepo;
    }

    public DutyRosterService(DutyRosterRepository dutyRosterRepo, UserRepository userRepo) {
        this(dutyRosterRepo, userRepo, null, null, null);
    }

    public DutyRosterService(DutyRosterRepository dutyRosterRepo) {
        this(dutyRosterRepo, null, null, null, null);
    }

    public DutyRoster createShiftSchedule(DutyRoster roster, String supervisorNameHeader, String supervisorBadgeHeader) {
        if (roster == null) {
            throw new IllegalArgumentException("Duty roster shift schedule data cannot be null");
        }

        // Apply supervisor metadata if provided in HTTP headers and not specified in body
        if (supervisorNameHeader != null && !supervisorNameHeader.isBlank() && 
            (roster.getSupervisorName() == null || roster.getSupervisorName().isBlank())) {
            roster.setSupervisorName(supervisorNameHeader.trim());
        } else if (roster.getSupervisorName() == null || roster.getSupervisorName().isBlank()) {
            roster.setSupervisorName("Shift Supervisor");
        }

        if (supervisorBadgeHeader != null && !supervisorBadgeHeader.isBlank() && 
            (roster.getSupervisorBadgeNumber() == null || roster.getSupervisorBadgeNumber().isBlank())) {
            roster.setSupervisorBadgeNumber(supervisorBadgeHeader.trim());
        }

        // Validate mandatory schedule requirements
        if (roster.getGuardName() == null || roster.getGuardName().isBlank()) {
            throw new IllegalArgumentException("Primary guard name is required to schedule a shift");
        }
        if (roster.getGuardBadgeNumber() == null || roster.getGuardBadgeNumber().isBlank()) {
            throw new IllegalArgumentException("Primary guard badge number is required to schedule a shift");
        }
        if (roster.getPostLocation() == null || roster.getPostLocation().isBlank()) {
            throw new IllegalArgumentException("Post location is required to schedule a shift");
        }

        // Auto-resolve guardEmail from user repository if missing
        if ((roster.getGuardEmail() == null || roster.getGuardEmail().isBlank()) && userRepo != null) {
            if (roster.getGuardBadgeNumber() != null && !roster.getGuardBadgeNumber().isBlank()) {
                userRepo.findByBadgeNumber(roster.getGuardBadgeNumber().trim())
                        .ifPresent(u -> roster.setGuardEmail(u.getEmail()));
            }
            if ((roster.getGuardEmail() == null || roster.getGuardEmail().isBlank()) &&
                roster.getGuardName() != null && !roster.getGuardName().isBlank()) {
                userRepo.findByFullNameIgnoreCase(roster.getGuardName().trim())
                        .ifPresent(u -> roster.setGuardEmail(u.getEmail()));
            }
        }

        // Set date default if absent
        if (roster.getDutyDate() == null) {
            roster.setDutyDate(LocalDate.now());
        }

        // Default shift type and timing if not provided
        if (roster.getShiftType() == null || roster.getShiftType().isBlank()) {
            roster.setShiftType("MORNING");
        }

        if ((roster.getStartTime() == null || roster.getStartTime().isBlank()) &&
            (roster.getEndTime() == null || roster.getEndTime().isBlank())) {
            applyDefaultTimingForShiftType(roster);
        }

        // Reliever assignment status handling
        if (roster.getRelieverName() != null && !roster.getRelieverName().isBlank()) {
            if (roster.getRelieverStatus() == null || roster.getRelieverStatus().isBlank() || 
                "NOT_ASSIGNED".equalsIgnoreCase(roster.getRelieverStatus())) {
                roster.setRelieverStatus("ASSIGNED");
            }
        } else {
            roster.setRelieverStatus("NOT_ASSIGNED");
        }

        if (roster.getStatus() == null || roster.getStatus().isBlank()) {
            roster.setStatus("SCHEDULED");
        }

        roster.setCreatedAt(LocalDateTime.now());
        roster.setUpdatedAt(LocalDateTime.now());

        return dutyRosterRepo.save(roster);
    }

    public List<DutyRoster> createBatchShiftSchedule(List<DutyRoster> rosters, String supervisorNameHeader, String supervisorBadgeHeader) {
        if (rosters == null || rosters.isEmpty()) {
            return Collections.emptyList();
        }
        List<DutyRoster> saved = new ArrayList<>();
        for (DutyRoster item : rosters) {
            saved.add(createShiftSchedule(item, supervisorNameHeader, supervisorBadgeHeader));
        }
        return saved;
    }

    @Transactional(readOnly = true)
    public List<DutyRoster> getAllDutyRoster() {
        return dutyRosterRepo.findAllByOrderByDutyDateDescStartTimeAsc();
    }

    @Transactional(readOnly = true)
    public List<DutyRoster> searchDutyRoster(LocalDate date, String status, String postLocation, String supervisor, String guard) {
        boolean hasFilter = (date != null) ||
                (status != null && !status.isBlank()) ||
                (postLocation != null && !postLocation.isBlank()) ||
                (supervisor != null && !supervisor.isBlank()) ||
                (guard != null && !guard.isBlank());

        if (!hasFilter) {
            return getAllDutyRoster();
        }

        String filterStatus = (status != null && !status.isBlank()) ? status.trim() : null;
        String filterPost = (postLocation != null && !postLocation.isBlank()) ? postLocation.trim() : null;
        String filterSup = (supervisor != null && !supervisor.isBlank()) ? supervisor.trim() : null;
        String filterGrd = (guard != null && !guard.isBlank()) ? guard.trim() : null;

        return dutyRosterRepo.searchRoster(date, filterStatus, filterPost, filterSup, filterGrd);
    }

    @Transactional(readOnly = true)
    public Optional<DutyRoster> getDutyRosterById(Long id) {
        return dutyRosterRepo.findById(id);
    }

    public DutyRoster updateShiftSchedule(Long id, DutyRoster updatedData) {
        return dutyRosterRepo.findById(id).map(existing -> {
            if (updatedData.getSupervisorName() != null && !updatedData.getSupervisorName().isBlank()) {
                existing.setSupervisorName(updatedData.getSupervisorName());
            }
            if (updatedData.getSupervisorBadgeNumber() != null) {
                existing.setSupervisorBadgeNumber(updatedData.getSupervisorBadgeNumber());
            }
            if (updatedData.getGuardName() != null && !updatedData.getGuardName().isBlank()) {
                existing.setGuardName(updatedData.getGuardName());
            }
            if (updatedData.getGuardBadgeNumber() != null && !updatedData.getGuardBadgeNumber().isBlank()) {
                existing.setGuardBadgeNumber(updatedData.getGuardBadgeNumber());
            }
            if (updatedData.getPostLocation() != null && !updatedData.getPostLocation().isBlank()) {
                existing.setPostLocation(updatedData.getPostLocation());
            }
            if (updatedData.getDutyDate() != null) {
                existing.setDutyDate(updatedData.getDutyDate());
            }
            if (updatedData.getShiftType() != null && !updatedData.getShiftType().isBlank()) {
                existing.setShiftType(updatedData.getShiftType());
            }
            if (updatedData.getStartTime() != null) {
                existing.setStartTime(updatedData.getStartTime());
            }
            if (updatedData.getEndTime() != null) {
                existing.setEndTime(updatedData.getEndTime());
            }
            if (updatedData.getRelieverName() != null) {
                existing.setRelieverName(updatedData.getRelieverName());
            }
            if (updatedData.getRelieverBadgeNumber() != null) {
                existing.setRelieverBadgeNumber(updatedData.getRelieverBadgeNumber());
            }
            if (updatedData.getRelieverStatus() != null) {
                existing.setRelieverStatus(updatedData.getRelieverStatus());
            }
            if (updatedData.getRelieverTimeSlot() != null) {
                existing.setRelieverTimeSlot(updatedData.getRelieverTimeSlot());
            }
            if (updatedData.getStatus() != null && !updatedData.getStatus().isBlank()) {
                existing.setStatus(updatedData.getStatus());
            }
            if (updatedData.getPriority() != null) {
                existing.setPriority(updatedData.getPriority());
            }
            if (updatedData.getNotes() != null) {
                existing.setNotes(updatedData.getNotes());
            }
            existing.setUpdatedAt(LocalDateTime.now());
            return dutyRosterRepo.save(existing);
        }).orElseThrow(() -> new NoSuchElementException("Duty roster shift schedule not found with id: " + id));
    }

    public DutyRoster updateRelieverAssignment(Long id, String relieverName, String relieverBadgeNumber, String relieverStatus, String relieverTimeSlot) {
        return dutyRosterRepo.findById(id).map(existing -> {
            existing.setRelieverName(relieverName);
            existing.setRelieverBadgeNumber(relieverBadgeNumber);
            if (relieverStatus != null && !relieverStatus.isBlank()) {
                existing.setRelieverStatus(relieverStatus);
            } else {
                existing.setRelieverStatus((relieverName != null && !relieverName.isBlank()) ? "ASSIGNED" : "NOT_ASSIGNED");
            }
            if (relieverTimeSlot != null) {
                existing.setRelieverTimeSlot(relieverTimeSlot);
            }
            existing.setUpdatedAt(LocalDateTime.now());
            return dutyRosterRepo.save(existing);
        }).orElseThrow(() -> new NoSuchElementException("Duty roster shift schedule not found with id: " + id));
    }

    public DutyRoster updateStatus(Long id, String status) {
        return dutyRosterRepo.findById(id).map(existing -> {
            existing.setStatus(status);
            existing.setUpdatedAt(LocalDateTime.now());
            return dutyRosterRepo.save(existing);
        }).orElseThrow(() -> new NoSuchElementException("Duty roster shift schedule not found with id: " + id));
    }

    public boolean deleteShiftSchedule(Long id) {
        if (dutyRosterRepo.existsById(id)) {
            dutyRosterRepo.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getRosterSummary(LocalDate date) {
        List<DutyRoster> rosterList = (date != null) 
                ? dutyRosterRepo.findByDutyDateOrderByStartTimeAsc(date) 
                : dutyRosterRepo.findAll();

        long totalShifts = rosterList.size();
        long scheduledCount = rosterList.stream().filter(r -> "SCHEDULED".equalsIgnoreCase(r.getStatus())).count();
        long activeCount = rosterList.stream().filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(r.getStatus())).count();
        long completedCount = rosterList.stream().filter(r -> "COMPLETED".equalsIgnoreCase(r.getStatus())).count();
        long relieversAssigned = rosterList.stream().filter(r -> r.getRelieverName() != null && !r.getRelieverName().isBlank()).count();
        long relieversPending = totalShifts - relieversAssigned;

        Set<String> uniquePosts = new HashSet<>();
        for (DutyRoster r : rosterList) {
            if (r.getPostLocation() != null) {
                uniquePosts.add(r.getPostLocation());
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("date", date != null ? date.toString() : "ALL");
        summary.put("totalShifts", totalShifts);
        summary.put("scheduledShifts", scheduledCount);
        summary.put("activeShifts", activeCount);
        summary.put("completedShifts", completedCount);
        summary.put("relieversAssignedCount", relieversAssigned);
        summary.put("relieversPendingCount", Math.max(0, relieversPending));
        summary.put("uniquePostsCovered", uniquePosts.size());
        summary.put("rosterTitle", "Guard Duty Schedule & Reliever Assignment Roster");

        return summary;
    }

    private void applyDefaultTimingForShiftType(DutyRoster roster) {
        String shiftType = roster.getShiftType() != null ? roster.getShiftType().toUpperCase() : "MORNING";
        switch (shiftType) {
            case "EVENING":
            case "AFTERNOON":
                roster.setStartTime("14:00");
                roster.setEndTime("22:00");
                break;
            case "NIGHT":
                roster.setStartTime("22:00");
                roster.setEndTime("06:00");
                break;
            case "SWING":
                roster.setStartTime("16:00");
                roster.setEndTime("00:00");
                break;
            case "MORNING":
            default:
                roster.setStartTime("06:00");
                roster.setEndTime("14:00");
                break;
        }
    }

    @Transactional(readOnly = true)
    public boolean isRosterAssignedToGuard(DutyRoster r, String email, String badge, String name) {
        if (r == null) return false;

        if (email != null && !email.isBlank()) {
            if (email.trim().equalsIgnoreCase(r.getGuardEmail())) {
                return true;
            }
        }

        if (badge != null && !badge.isBlank()) {
            String b = badge.trim();
            if (b.equalsIgnoreCase(r.getGuardBadgeNumber()) || b.equalsIgnoreCase(r.getRelieverBadgeNumber())) {
                return true;
            }
            String bDigits = b.replaceAll("\\D+", "");
            if (!bDigits.isEmpty()) {
                String rGuardDigits = r.getGuardBadgeNumber() != null ? r.getGuardBadgeNumber().replaceAll("\\D+", "") : "";
                String rRelieverDigits = r.getRelieverBadgeNumber() != null ? r.getRelieverBadgeNumber().replaceAll("\\D+", "") : "";
                if (bDigits.equals(rGuardDigits) || bDigits.equals(rRelieverDigits)) {
                    return true;
                }
            }
        }

        if (name != null && !name.isBlank()) {
            String n = name.trim().toLowerCase();
            String rGuard = r.getGuardName() != null ? r.getGuardName().trim().toLowerCase() : "";
            String rReliever = r.getRelieverName() != null ? r.getRelieverName().trim().toLowerCase() : "";
            if (rGuard.equals(n) || rReliever.equals(n)) {
                return true;
            }
            if (!n.isEmpty() && (rGuard.contains(n) || n.contains(rGuard)) && rGuard.length() > 3) {
                return true;
            }
        }

        return false;
    }

    @Transactional(readOnly = true)
    public boolean isDutyAssignedToGuard(Long dutyId, String email, String badge, String name) {
        return dutyRosterRepo.findById(dutyId)
                .map(r -> isRosterAssignedToGuard(r, email, badge, name))
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getGuardDutyRoster(String guardEmail, String guardBadge, String guardName) {
        LocalDate today = LocalDate.now();

        // Enforce guard matching: retrieve duty rosters and filter strictly to this guard
        List<DutyRoster> allShifts = dutyRosterRepo.findAll();
        List<DutyRoster> guardShifts = allShifts.stream()
                .filter(r -> isRosterAssignedToGuard(r, guardEmail, guardBadge, guardName))
                .toList();

        // Today's duties (sorted by startTime ascending)
        List<DutyRoster> todayDuties = guardShifts.stream()
                .filter(r -> r.getDutyDate() != null && r.getDutyDate().isEqual(today))
                .sorted(Comparator.comparing(r -> r.getStartTime() != null ? r.getStartTime() : "00:00"))
                .toList();

        // Upcoming duties (strictly after today, sorted chronologically ascending: date ASC, then startTime ASC)
        List<DutyRoster> upcomingDuties = guardShifts.stream()
                .filter(r -> r.getDutyDate() != null && r.getDutyDate().isAfter(today))
                .sorted(Comparator.comparing(DutyRoster::getDutyDate)
                        .thenComparing(r -> r.getStartTime() != null ? r.getStartTime() : "00:00"))
                .toList();

        // Past duties (before today, sorted most recent first)
        List<DutyRoster> pastDuties = guardShifts.stream()
                .filter(r -> r.getDutyDate() != null && r.getDutyDate().isBefore(today))
                .sorted(Comparator.comparing(DutyRoster::getDutyDate).reversed()
                        .thenComparing(r -> r.getStartTime() != null ? r.getStartTime() : "00:00"))
                .toList();

        // Combined all duties with TODAY'S DUTY AT THE TOP!
        List<DutyRoster> allDutiesWithTodayAtTop = new ArrayList<>();
        allDutiesWithTodayAtTop.addAll(todayDuties);
        allDutiesWithTodayAtTop.addAll(upcomingDuties);
        allDutiesWithTodayAtTop.addAll(pastDuties);

        DutyRoster todayDuty = todayDuties.isEmpty() ? null : todayDuties.get(0);
        DutyRoster nextUpcomingDuty = upcomingDuties.isEmpty() ? null : upcomingDuties.get(0);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("guardEmail", guardEmail);
        result.put("guardBadgeNumber", guardBadge);
        result.put("guardName", guardName);
        result.put("hasTodayDuty", !todayDuties.isEmpty());
        result.put("todayDuty", todayDuty);
        result.put("todayDuties", todayDuties);
        result.put("upcomingDuties", upcomingDuties);
        result.put("pastDuties", pastDuties);
        result.put("allDuties", allDutiesWithTodayAtTop);
        result.put("totalUpcoming", upcomingDuties.size());
        result.put("totalAssigned", guardShifts.size());
        result.put("nextUpcomingDuty", nextUpcomingDuty);
        result.put("serverTime", LocalDateTime.now());

        return result;
    }

    @Transactional(readOnly = true)
    public List<DutyRoster> getGuardDutyRosterList(String guardEmail, String guardBadge, String guardName) {
        Map<String, Object> map = getGuardDutyRoster(guardEmail, guardBadge, guardName);
        @SuppressWarnings("unchecked")
        List<DutyRoster> list = (List<DutyRoster>) map.get("allDuties");
        return list;
    }

    /**
     * Reassigns an absent guard's duty to an available replacement guard.
     * Maintains roster history containing both original and new assignments,
     * reason for reassignment, notifies the replacement guard, and ensures
     * the absent guard's status is marked as an excused absence (NOT a no-show).
     */
    public DutyReassignmentHistory reassignDutyShift(
            Long dutyRosterId,
            DutyReassignmentRequest req,
            String supervisorNameHeader,
            String supervisorBadgeHeader) {
        if (dutyRosterId == null) {
            throw new IllegalArgumentException("Duty roster ID is required for reassignment");
        }
        if (req == null) {
            throw new IllegalArgumentException("Reassignment payload cannot be null");
        }
        if (req.getReplacementGuardName() == null || req.getReplacementGuardName().isBlank()) {
            throw new IllegalArgumentException("Replacement guard name is required");
        }
        if (req.getReplacementGuardBadgeNumber() == null || req.getReplacementGuardBadgeNumber().isBlank()) {
            throw new IllegalArgumentException("Replacement guard badge number is required");
        }
        if (req.getReason() == null || req.getReason().isBlank()) {
            throw new IllegalArgumentException("Reassignment reason is required");
        }

        DutyRoster roster = dutyRosterRepo.findById(dutyRosterId)
                .orElseThrow(() -> new NoSuchElementException("Duty roster shift not found with ID: " + dutyRosterId));

        // 1. Capture original absent guard details
        String originalGuardName = roster.getGuardName();
        String originalGuardBadge = roster.getGuardBadgeNumber();
        String originalGuardEmail = roster.getGuardEmail();

        // 2. Resolve supervisor metadata
        String supervisorName = (supervisorNameHeader != null && !supervisorNameHeader.isBlank())
                ? supervisorNameHeader.trim()
                : (req.getSupervisorName() != null && !req.getSupervisorName().isBlank())
                ? req.getSupervisorName().trim()
                : (roster.getSupervisorName() != null ? roster.getSupervisorName() : "Shift Supervisor");

        String supervisorBadge = (supervisorBadgeHeader != null && !supervisorBadgeHeader.isBlank())
                ? supervisorBadgeHeader.trim()
                : (req.getSupervisorBadgeNumber() != null && !req.getSupervisorBadgeNumber().isBlank())
                ? req.getSupervisorBadgeNumber().trim()
                : roster.getSupervisorBadgeNumber();

        // 3. Resolve replacement guard email from repository if not explicitly supplied
        String replacementEmail = req.getReplacementGuardEmail();
        if ((replacementEmail == null || replacementEmail.isBlank()) && userRepo != null) {
            try {
                var userOpt = userRepo.findByBadgeNumber(req.getReplacementGuardBadgeNumber().trim());
                if (userOpt.isPresent()) {
                    replacementEmail = userOpt.get().getEmail();
                } else {
                    var userByName = userRepo.findByFullNameIgnoreCase(req.getReplacementGuardName().trim());
                    if (userByName.isPresent()) {
                        replacementEmail = userByName.get().getEmail();
                    }
                }
            } catch (Exception ignored) {}
        }
        if (replacementEmail == null || replacementEmail.isBlank()) {
            replacementEmail = "guard@" + req.getReplacementGuardBadgeNumber().toLowerCase().replaceAll("[^a-z0-9]", "") + ".campusguard.edu";
        }

        // 4. Update roster record with replacement guard & excused absence flags
        roster.setReassigned(true);
        roster.setOriginalGuardName(originalGuardName);
        roster.setOriginalGuardBadgeNumber(originalGuardBadge);
        roster.setOriginalGuardEmail(originalGuardEmail);
        roster.setReassignmentReason(req.getReason().trim());
        roster.setReassignedAt(LocalDateTime.now());

        // CRITICAL REQUIREMENT: Excused absence - does NOT count as a no-show
        roster.setAbsentGuardAttendanceStatus("EXCUSED_ABSENCE");
        roster.setCountsAsNoShow(false);

        // Assign to replacement guard
        roster.setGuardName(req.getReplacementGuardName().trim());
        roster.setGuardBadgeNumber(req.getReplacementGuardBadgeNumber().trim());
        roster.setGuardEmail(replacementEmail);
        roster.setStatus("REASSIGNED");
        roster.setNotes("Reassigned from Officer " + originalGuardName + " (" + req.getReason().trim() + "). Excused absence - not marked as no-show.");
        roster.setSupervisorName(supervisorName);
        if (supervisorBadge != null) {
            roster.setSupervisorBadgeNumber(supervisorBadge);
        }

        DutyRoster updatedRoster = dutyRosterRepo.save(roster);

        // 5. Create and persist Roster Reassignment History audit entry
        DutyReassignmentHistory history = new DutyReassignmentHistory(
                updatedRoster.getId(),
                updatedRoster.getDutyDate(),
                updatedRoster.getPostLocation(),
                updatedRoster.getShiftType(),
                (updatedRoster.getStartTime() != null ? updatedRoster.getStartTime() : "") + " - " + (updatedRoster.getEndTime() != null ? updatedRoster.getEndTime() : ""),
                originalGuardName,
                originalGuardBadge,
                originalGuardEmail,
                updatedRoster.getGuardName(),
                updatedRoster.getGuardBadgeNumber(),
                updatedRoster.getGuardEmail(),
                req.getReason().trim(),
                supervisorName,
                supervisorBadge
        );
        history.setOriginalGuardAttendanceStatus("EXCUSED_ABSENCE");
        history.setCountsAsNoShow(false);
        history.setReassignedAt(LocalDateTime.now());

        if (reassignmentRepo != null) {
            history = reassignmentRepo.save(history);
        }

        // 6. Notify the replacement guard about the new duty assignment
        if (notificationRepo != null) {
            try {
                String shiftTimes = (updatedRoster.getStartTime() != null ? updatedRoster.getStartTime() : "Shift") + " to " + (updatedRoster.getEndTime() != null ? updatedRoster.getEndTime() : "");
                String message = String.format(
                        "You have been assigned as replacement officer for %s at %s (%s) on %s. Reason: %s.",
                        originalGuardName,
                        updatedRoster.getPostLocation(),
                        shiftTimes,
                        updatedRoster.getDutyDate() != null ? updatedRoster.getDutyDate().toString() : "Today",
                        req.getReason().trim()
                );

                Notification notif = new Notification(
                        "Security Guard",
                        updatedRoster.getGuardEmail(),
                        "Duty Reassignment: " + updatedRoster.getPostLocation(),
                        message,
                        "DISPATCH",
                        "HIGH"
                );
                notificationRepo.save(notif);
            } catch (Exception ignored) {}
        }

        // 7. Record in system operational audit log
        if (auditLogRepo != null) {
            try {
                AuditLog log = new AuditLog(
                        "REASSIGN_DUTY",
                        "Shift at " + updatedRoster.getPostLocation() + " reassigned from " + originalGuardName + " (" + originalGuardBadge + ") to " + updatedRoster.getGuardName() + " (" + updatedRoster.getGuardBadgeNumber() + "). Reason: " + req.getReason() + ". Excused absence - no-show: false",
                        supervisorName,
                        "Shift Supervisor",
                        "127.0.0.1",
                        "INFO"
                );
                auditLogRepo.save(log);
            } catch (Exception ignored) {}
        }

        return history;
    }

    @Transactional(readOnly = true)
    public List<DutyReassignmentHistory> getAllReassignmentHistory() {
        if (reassignmentRepo == null) return Collections.emptyList();
        return reassignmentRepo.findAllByOrderByReassignedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<DutyReassignmentHistory> getReassignmentHistoryForRoster(Long dutyRosterId) {
        if (reassignmentRepo == null || dutyRosterId == null) return Collections.emptyList();
        return reassignmentRepo.findByDutyRosterIdOrderByReassignedAtDesc(dutyRosterId);
    }
}
