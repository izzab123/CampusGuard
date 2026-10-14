package com.campusguard.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "duty_reassignment_history")
public class DutyReassignmentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long dutyRosterId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dutyDate;

    private String postLocation;

    private String shiftType;

    private String shiftHours;

    // Original Guard Information
    @Column(nullable = false)
    private String originalGuardName;

    @Column(nullable = false)
    private String originalGuardBadgeNumber;

    private String originalGuardEmail;

    // Status: Ensures absence is marked as excused and does NOT count as a no-show
    @Column(nullable = false)
    private String originalGuardAttendanceStatus; // "EXCUSED_ABSENCE"

    private boolean countsAsNoShow; // explicitly false

    // Replacement Guard Information
    @Column(nullable = false)
    private String replacementGuardName;

    @Column(nullable = false)
    private String replacementGuardBadgeNumber;

    private String replacementGuardEmail;

    // Reason and Supervisor Auditing
    @Column(nullable = false)
    private String reassignmentReason;

    private String supervisorName;

    private String supervisorBadgeNumber;

    @Column(nullable = false)
    private LocalDateTime reassignedAt;

    public DutyReassignmentHistory() {
        this.reassignedAt = LocalDateTime.now();
        this.originalGuardAttendanceStatus = "EXCUSED_ABSENCE";
        this.countsAsNoShow = false;
    }

    public DutyReassignmentHistory(
            Long dutyRosterId,
            LocalDate dutyDate,
            String postLocation,
            String shiftType,
            String shiftHours,
            String originalGuardName,
            String originalGuardBadgeNumber,
            String originalGuardEmail,
            String replacementGuardName,
            String replacementGuardBadgeNumber,
            String replacementGuardEmail,
            String reassignmentReason,
            String supervisorName,
            String supervisorBadgeNumber) {
        this();
        this.dutyRosterId = dutyRosterId;
        this.dutyDate = dutyDate;
        this.postLocation = postLocation;
        this.shiftType = shiftType;
        this.shiftHours = shiftHours;
        this.originalGuardName = originalGuardName;
        this.originalGuardBadgeNumber = originalGuardBadgeNumber;
        this.originalGuardEmail = originalGuardEmail;
        this.replacementGuardName = replacementGuardName;
        this.replacementGuardBadgeNumber = replacementGuardBadgeNumber;
        this.replacementGuardEmail = replacementGuardEmail;
        this.reassignmentReason = reassignmentReason;
        this.supervisorName = supervisorName != null ? supervisorName : "Shift Supervisor";
        this.supervisorBadgeNumber = supervisorBadgeNumber;
        this.originalGuardAttendanceStatus = "EXCUSED_ABSENCE";
        this.countsAsNoShow = false;
        this.reassignedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDutyRosterId() { return dutyRosterId; }
    public void setDutyRosterId(Long dutyRosterId) { this.dutyRosterId = dutyRosterId; }

    public LocalDate getDutyDate() { return dutyDate; }
    public void setDutyDate(LocalDate dutyDate) { this.dutyDate = dutyDate; }

    public String getPostLocation() { return postLocation; }
    public void setPostLocation(String postLocation) { this.postLocation = postLocation; }

    public String getShiftType() { return shiftType; }
    public void setShiftType(String shiftType) { this.shiftType = shiftType; }

    public String getShiftHours() { return shiftHours; }
    public void setShiftHours(String shiftHours) { this.shiftHours = shiftHours; }

    public String getOriginalGuardName() { return originalGuardName; }
    public void setOriginalGuardName(String originalGuardName) { this.originalGuardName = originalGuardName; }

    public String getOriginalGuardBadgeNumber() { return originalGuardBadgeNumber; }
    public void setOriginalGuardBadgeNumber(String originalGuardBadgeNumber) { this.originalGuardBadgeNumber = originalGuardBadgeNumber; }

    public String getOriginalGuardEmail() { return originalGuardEmail; }
    public void setOriginalGuardEmail(String originalGuardEmail) { this.originalGuardEmail = originalGuardEmail; }

    public String getOriginalGuardAttendanceStatus() { return originalGuardAttendanceStatus; }
    public void setOriginalGuardAttendanceStatus(String originalGuardAttendanceStatus) { this.originalGuardAttendanceStatus = originalGuardAttendanceStatus; }

    public boolean isCountsAsNoShow() { return countsAsNoShow; }
    public void setCountsAsNoShow(boolean countsAsNoShow) { this.countsAsNoShow = countsAsNoShow; }

    public String getReplacementGuardName() { return replacementGuardName; }
    public void setReplacementGuardName(String replacementGuardName) { this.replacementGuardName = replacementGuardName; }

    public String getReplacementGuardBadgeNumber() { return replacementGuardBadgeNumber; }
    public void setReplacementGuardBadgeNumber(String replacementGuardBadgeNumber) { this.replacementGuardBadgeNumber = replacementGuardBadgeNumber; }

    public String getReplacementGuardEmail() { return replacementGuardEmail; }
    public void setReplacementGuardEmail(String replacementGuardEmail) { this.replacementGuardEmail = replacementGuardEmail; }

    public String getReassignmentReason() { return reassignmentReason; }
    public void setReassignmentReason(String reassignmentReason) { this.reassignmentReason = reassignmentReason; }

    public String getSupervisorName() { return supervisorName; }
    public void setSupervisorName(String supervisorName) { this.supervisorName = supervisorName; }

    public String getSupervisorBadgeNumber() { return supervisorBadgeNumber; }
    public void setSupervisorBadgeNumber(String supervisorBadgeNumber) { this.supervisorBadgeNumber = supervisorBadgeNumber; }

    public LocalDateTime getReassignedAt() { return reassignedAt; }
    public void setReassignedAt(LocalDateTime reassignedAt) { this.reassignedAt = reassignedAt; }
}
