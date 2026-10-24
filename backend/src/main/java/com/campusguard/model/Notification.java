package com.campusguard.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipientRole; // ALL, Student, Proctor and DSW, Security Guard, Shift Supervisor, Admin

    private String recipientEmail;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    private String category; // DISPATCH, INCIDENT, SYSTEM, CLEARANCE, DUTY_ABSENCE

    private String priority; // LOW, MEDIUM, HIGH, CRITICAL

    @JsonProperty("isRead")
    private boolean isRead;

    // Guard absence & duty details (populated dynamically for guard attendance alerts)
    private String guardName;
    private String badgeNumber;
    private String postLocation;
    private String shiftHours;
    private String dutyStatus; // NO_SHOW, OVERDUE, ABSENT, ESCALATED
    private Long shiftId;
    private Long incidentId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Notification() {
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
        this.priority = "MEDIUM";
        this.category = "SYSTEM";
    }

    public Notification(String recipientRole, String recipientEmail, String title, String message, String category, String priority) {
        this();
        this.recipientRole = recipientRole;
        this.recipientEmail = recipientEmail;
        this.title = title;
        this.message = message;
        this.category = category != null ? category : "SYSTEM";
        this.priority = priority != null ? priority : "MEDIUM";
    }

    public Notification(String recipientRole, String recipientEmail, String title, String message, String category, String priority,
                        String guardName, String badgeNumber, String postLocation, String shiftHours, String dutyStatus, Long shiftId) {
        this(recipientRole, recipientEmail, title, message, category, priority);
        this.guardName = guardName;
        this.badgeNumber = badgeNumber;
        this.postLocation = postLocation;
        this.shiftHours = shiftHours;
        this.dutyStatus = dutyStatus != null ? dutyStatus : "NO_SHOW";
        this.shiftId = shiftId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRecipientRole() { return recipientRole; }
    public void setRecipientRole(String recipientRole) { this.recipientRole = recipientRole; }

    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    @JsonProperty("isRead")
    public boolean isRead() { return isRead; }

    @JsonProperty("isRead")
    public void setRead(boolean read) { isRead = read; }

    @JsonProperty("read")
    public boolean getRead() { return isRead; }

    public String getGuardName() { return guardName; }
    public void setGuardName(String guardName) { this.guardName = guardName; }

    public String getBadgeNumber() { return badgeNumber; }
    public void setBadgeNumber(String badgeNumber) { this.badgeNumber = badgeNumber; }

    public String getPostLocation() { return postLocation; }
    public void setPostLocation(String postLocation) { this.postLocation = postLocation; }

    public String getShiftHours() { return shiftHours; }
    public void setShiftHours(String shiftHours) { this.shiftHours = shiftHours; }

    public String getDutyStatus() { return dutyStatus; }
    public void setDutyStatus(String dutyStatus) { this.dutyStatus = dutyStatus; }

    public Long getShiftId() { return shiftId; }
    public void setShiftId(Long shiftId) { this.shiftId = shiftId; }

    public Long getIncidentId() { return incidentId; }
    public void setIncidentId(Long incidentId) { this.incidentId = incidentId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

