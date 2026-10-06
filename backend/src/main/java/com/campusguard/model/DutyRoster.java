package com.campusguard.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "duty_rosters")
public class DutyRoster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Shift Supervisor details
    @Column(nullable = false)
    private String supervisorName;

    private String supervisorBadgeNumber;

    // Primary Guard Details
    @Column(nullable = false)
    private String guardName;

    @Column(nullable = false)
    private String guardBadgeNumber;

    // Post / Station Location
    @Column(nullable = false)
    private String postLocation;

    // Shift Schedule Dates & Timings
    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dutyDate;

    private String shiftType; // e.g. MORNING, EVENING, NIGHT, CUSTOM

    private String startTime; // e.g. "08:00"

    private String endTime; // e.g. "16:00"

    private LocalDateTime shiftStart;
    private LocalDateTime shiftEnd;

    // Reliever Assignment Details
    private String relieverName;

    private String relieverBadgeNumber;

    private String relieverStatus; // ASSIGNED, STANDBY, DEPLOYED, NOT_ASSIGNED

    private String relieverTimeSlot; // e.g., "12:00 - 13:00 (Lunch Break Coverage)"

    // Operational Status & Metadata
    @Column(nullable = false)
    private String status; // SCHEDULED, CONFIRMED, ACTIVE, COMPLETED, CANCELLED

    private String priority; // NORMAL, HIGH, CRITICAL

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DutyRoster() {
        this.status = "SCHEDULED";
        this.priority = "NORMAL";
        this.relieverStatus = "NOT_ASSIGNED";
        this.dutyDate = LocalDate.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public DutyRoster(String supervisorName, String guardName, String guardBadgeNumber, String postLocation, LocalDate dutyDate, String shiftType, String startTime, String endTime) {
        this();
        this.supervisorName = supervisorName;
        this.guardName = guardName;
        this.guardBadgeNumber = guardBadgeNumber;
        this.postLocation = postLocation;
        this.dutyDate = dutyDate != null ? dutyDate : LocalDate.now();
        this.shiftType = shiftType;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    @PrePersist
    public void onPrePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
        if (this.dutyDate == null) {
            this.dutyDate = LocalDate.now();
        }
        if (this.status == null || this.status.isBlank()) {
            this.status = "SCHEDULED";
        }
        if (this.priority == null || this.priority.isBlank()) {
            this.priority = "NORMAL";
        }
        if (this.relieverName != null && !this.relieverName.isBlank()) {
            if (this.relieverStatus == null || this.relieverStatus.isBlank() || "NOT_ASSIGNED".equalsIgnoreCase(this.relieverStatus)) {
                this.relieverStatus = "ASSIGNED";
            }
        } else {
            if (this.relieverStatus == null || this.relieverStatus.isBlank()) {
                this.relieverStatus = "NOT_ASSIGNED";
            }
        }
        computeShiftTimestamps();
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.relieverName != null && !this.relieverName.isBlank()) {
            if (this.relieverStatus == null || this.relieverStatus.isBlank() || "NOT_ASSIGNED".equalsIgnoreCase(this.relieverStatus)) {
                this.relieverStatus = "ASSIGNED";
            }
        }
        computeShiftTimestamps();
    }

    private void computeShiftTimestamps() {
        if (this.dutyDate != null) {
            if (this.startTime != null && !this.startTime.isBlank() && this.shiftStart == null) {
                try {
                    String cleanStart = this.startTime.trim();
                    if (cleanStart.length() == 5) {
                        this.shiftStart = LocalDateTime.of(this.dutyDate, LocalTime.parse(cleanStart));
                    }
                } catch (Exception ignored) {}
            }
            if (this.endTime != null && !this.endTime.isBlank() && this.shiftEnd == null) {
                try {
                    String cleanEnd = this.endTime.trim();
                    if (cleanEnd.length() == 5) {
                        this.shiftEnd = LocalDateTime.of(this.dutyDate, LocalTime.parse(cleanEnd));
                    }
                } catch (Exception ignored) {}
            }
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSupervisorName() { return supervisorName; }
    public void setSupervisorName(String supervisorName) { this.supervisorName = supervisorName; }

    public String getSupervisorBadgeNumber() { return supervisorBadgeNumber; }
    public void setSupervisorBadgeNumber(String supervisorBadgeNumber) { this.supervisorBadgeNumber = supervisorBadgeNumber; }

    public String getGuardName() { return guardName; }
    public void setGuardName(String guardName) { this.guardName = guardName; }

    public String getGuardBadgeNumber() { return guardBadgeNumber; }
    public void setGuardBadgeNumber(String guardBadgeNumber) { this.guardBadgeNumber = guardBadgeNumber; }

    public String getPostLocation() { return postLocation; }
    public void setPostLocation(String postLocation) { this.postLocation = postLocation; }

    public LocalDate getDutyDate() { return dutyDate; }
    public void setDutyDate(LocalDate dutyDate) { this.dutyDate = dutyDate; }

    public String getShiftType() { return shiftType; }
    public void setShiftType(String shiftType) { this.shiftType = shiftType; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public LocalDateTime getShiftStart() { return shiftStart; }
    public void setShiftStart(LocalDateTime shiftStart) { this.shiftStart = shiftStart; }

    public LocalDateTime getShiftEnd() { return shiftEnd; }
    public void setShiftEnd(LocalDateTime shiftEnd) { this.shiftEnd = shiftEnd; }

    public String getRelieverName() { return relieverName; }
    public void setRelieverName(String relieverName) { this.relieverName = relieverName; }

    public String getRelieverBadgeNumber() { return relieverBadgeNumber; }
    public void setRelieverBadgeNumber(String relieverBadgeNumber) { this.relieverBadgeNumber = relieverBadgeNumber; }

    public String getRelieverStatus() { return relieverStatus; }
    public void setRelieverStatus(String relieverStatus) { this.relieverStatus = relieverStatus; }

    public String getRelieverTimeSlot() { return relieverTimeSlot; }
    public void setRelieverTimeSlot(String relieverTimeSlot) { this.relieverTimeSlot = relieverTimeSlot; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Backward compatibility and lenient property aliases
    @JsonProperty("officerName")
    public void setOfficerName(String officerName) {
        if (this.guardName == null || this.guardName.isBlank()) {
            this.guardName = officerName;
        }
    }

    @JsonProperty("officerName")
    public String getOfficerName() {
        return this.guardName;
    }

    @JsonProperty("badgeNumber")
    public void setBadgeNumber(String badgeNumber) {
        if (this.guardBadgeNumber == null || this.guardBadgeNumber.isBlank()) {
            this.guardBadgeNumber = badgeNumber;
        }
    }

    @JsonProperty("badgeNumber")
    public String getBadgeNumber() {
        return this.guardBadgeNumber;
    }

    @JsonProperty("shiftDate")
    public void setShiftDate(LocalDate shiftDate) {
        if (this.dutyDate == null) {
            this.dutyDate = shiftDate;
        }
    }

    @JsonProperty("shiftDate")
    public LocalDate getShiftDate() {
        return this.dutyDate;
    }

    @JsonProperty("location")
    public void setLocation(String location) {
        if (this.postLocation == null || this.postLocation.isBlank()) {
            this.postLocation = location;
        }
    }

    @JsonProperty("location")
    public String getLocation() {
        return this.postLocation;
    }
}
