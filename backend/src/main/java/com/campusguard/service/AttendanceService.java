package com.campusguard.service;

import com.campusguard.model.AttendanceConfig;
import com.campusguard.model.AuditLog;
import com.campusguard.model.DutyRoster;
import com.campusguard.model.Notification;
import com.campusguard.repository.AttendanceConfigRepository;
import com.campusguard.repository.AuditLogRepository;
import com.campusguard.repository.DutyRosterRepository;
import com.campusguard.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class AttendanceService {

    private final DutyRosterRepository dutyRosterRepo;
    private final AttendanceConfigRepository configRepo;
    private final NotificationRepository notificationRepo;
    private final AuditLogRepository auditLogRepo;

    @Autowired
    public AttendanceService(
            DutyRosterRepository dutyRosterRepo,
            AttendanceConfigRepository configRepo,
            @Autowired(required = false) NotificationRepository notificationRepo,
            @Autowired(required = false) AuditLogRepository auditLogRepo) {
        this.dutyRosterRepo = dutyRosterRepo;
        this.configRepo = configRepo;
        this.notificationRepo = notificationRepo;
        this.auditLogRepo = auditLogRepo;
    }

    public AttendanceConfig getConfig() {
        return configRepo.findById(1L).orElseGet(() -> {
            AttendanceConfig defaultCfg = new AttendanceConfig(1L, 15, true, "System Administrator");
            return configRepo.save(defaultCfg);
        });
    }

    public AttendanceConfig updateConfig(int gracePeriodMinutes, String updatedBy) {
        if (gracePeriodMinutes < 1) {
            throw new IllegalArgumentException("Grace period must be at least 1 minute");
        }
        AttendanceConfig config = getConfig();
        int oldVal = config.getGracePeriodMinutes();
        config.setGracePeriodMinutes(gracePeriodMinutes);
        config.setUpdatedBy(updatedBy != null && !updatedBy.isBlank() ? updatedBy : "System Administrator");
        config.setUpdatedAt(LocalDateTime.now());
        AttendanceConfig saved = configRepo.save(config);

        if (auditLogRepo != null) {
            AuditLog log = new AuditLog(
                    "UPDATE_NO_SHOW_GRACE_PERIOD",
                    "Updated no-show grace period from " + oldVal + "m to " + gracePeriodMinutes + "m",
                    config.getUpdatedBy(),
                    "Admin",
                    "127.0.0.1",
                    "MEDIUM"
            );
            auditLogRepo.save(log);
        }

        // Trigger immediate evaluation with the updated grace period
        evaluateAndMarkNoShows();

        return saved;
    }

    /**
     * Automatic periodic evaluation.
     * Automatically marks a guard's duty as No-show if no check-in exists X minutes after shift start.
     * Never flags guards who have checked in, whose duties have been reassigned, or whose leave has been approved.
     */
    @Scheduled(fixedRate = 60000)
    public List<DutyRoster> evaluateAndMarkNoShows() {
        AttendanceConfig config = getConfig();
        if (!config.isAutoDetectionEnabled()) {
            return Collections.emptyList();
        }

        int gracePeriod = config.getGracePeriodMinutes();
        LocalDateTime now = LocalDateTime.now();
        List<DutyRoster> allRosters = dutyRosterRepo.findAll();
        List<DutyRoster> newlyMarkedNoShows = new ArrayList<>();

        for (DutyRoster roster : allRosters) {
            if (roster.isEligibleForNoShow(now, gracePeriod)) {
                roster.setStatus("NO_SHOW");
                roster.setAttendanceStatus("NO_SHOW");
                roster.setCountsAsNoShow(true);
                roster.setNoShowFlaggedAt(now);
                roster.setNoShowReason("Shift unstaffed " + gracePeriod + " minutes after scheduled start with no check-in record.");

                DutyRoster saved = dutyRosterRepo.save(roster);
                newlyMarkedNoShows.add(saved);

                // Send alert notification to supervisors
                if (notificationRepo != null) {
                    Notification notif = new Notification(
                            "Shift Supervisor",
                            null,
                            "URGENT: Guard No-Show at " + saved.getPostLocation(),
                            "Officer " + saved.getGuardName() + " (" + saved.getGuardBadgeNumber() + ") failed to check in for duty at " + saved.getPostLocation() + " within " + gracePeriod + " min grace period. Post is currently unstaffed.",
                            "DISPATCH",
                            "HIGH"
                    );
                    notificationRepo.save(notif);
                }

                // Audit log immutable record
                if (auditLogRepo != null) {
                    AuditLog log = new AuditLog(
                            "GUARD_NO_SHOW_DETECTED",
                            "Automated detection: Officer " + saved.getGuardName() + " flagged as NO_SHOW at " + saved.getPostLocation() + " (Grace: " + gracePeriod + "m)",
                            "AutoSentinel",
                            "SYSTEM",
                            "127.0.0.1",
                            "HIGH"
                    );
                    auditLogRepo.save(log);
                }
            }
        }

        return newlyMarkedNoShows;
    }

    public List<DutyRoster> getNoShowRecords() {
        evaluateAndMarkNoShows();
        return dutyRosterRepo.findAll().stream()
                .filter(r -> "NO_SHOW".equalsIgnoreCase(r.getStatus()) || "NO_SHOW".equalsIgnoreCase(r.getAttendanceStatus()))
                .sorted((a, b) -> {
                    LocalDateTime t1 = a.getNoShowFlaggedAt() != null ? a.getNoShowFlaggedAt() : a.getUpdatedAt();
                    LocalDateTime t2 = b.getNoShowFlaggedAt() != null ? b.getNoShowFlaggedAt() : b.getUpdatedAt();
                    if (t1 == null && t2 == null) return 0;
                    if (t1 == null) return 1;
                    if (t2 == null) return -1;
                    return t2.compareTo(t1);
                })
                .toList();
    }

    public List<DutyRoster> getAttendanceRecords(LocalDate date, String status) {
        evaluateAndMarkNoShows();
        LocalDate queryDate = date != null ? date : LocalDate.now();
        List<DutyRoster> list = dutyRosterRepo.findByDutyDate(queryDate);
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            list = list.stream().filter(r ->
                    status.equalsIgnoreCase(r.getStatus()) || status.equalsIgnoreCase(r.getAttendanceStatus())
            ).toList();
        }
        return list;
    }

    public DutyRoster checkInGuard(Long rosterId, String note) {
        DutyRoster roster = dutyRosterRepo.findById(rosterId)
                .orElseThrow(() -> new IllegalArgumentException("Duty roster not found: " + rosterId));

        roster.setCheckedIn(true);
        roster.setCheckInTime(LocalDateTime.now());
        roster.setStatus("CHECKED_IN");
        roster.setAttendanceStatus("PRESENT");
        if (note != null && !note.isBlank()) {
            roster.setNotes((roster.getNotes() != null ? roster.getNotes() + " | " : "") + note);
        }

        if (auditLogRepo != null) {
            AuditLog log = new AuditLog(
                    "GUARD_CHECKED_IN",
                    "Officer " + roster.getGuardName() + " checked in for duty at " + roster.getPostLocation(),
                    roster.getGuardName(),
                    "Security Guard",
                    "127.0.0.1",
                    "LOW"
            );
            auditLogRepo.save(log);
        }

        return dutyRosterRepo.save(roster);
    }

    public DutyRoster approveGuardLeave(Long rosterId, String reason, String approver) {
        DutyRoster roster = dutyRosterRepo.findById(rosterId)
                .orElseThrow(() -> new IllegalArgumentException("Duty roster not found: " + rosterId));

        roster.setLeaveApproved(true);
        roster.setLeaveReason(reason != null && !reason.isBlank() ? reason : "Supervisor Approved Leave");
        roster.setStatus("APPROVED_LEAVE");
        roster.setAttendanceStatus("ON_LEAVE");
        roster.setCountsAsNoShow(false);

        if (auditLogRepo != null) {
            AuditLog log = new AuditLog(
                    "GUARD_LEAVE_APPROVED",
                    "Approved leave for Officer " + roster.getGuardName() + " at " + roster.getPostLocation() + ". Reason: " + roster.getLeaveReason(),
                    approver != null ? approver : "Supervisor",
                    "Shift Supervisor",
                    "127.0.0.1",
                    "MEDIUM"
            );
            auditLogRepo.save(log);
        }

        return dutyRosterRepo.save(roster);
    }
}
