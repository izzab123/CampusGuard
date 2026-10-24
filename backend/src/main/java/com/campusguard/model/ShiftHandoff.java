package com.campusguard.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "shift_handoffs")
public class ShiftHandoff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Assigned Gate / Station Post Location (e.g., "North Gate Checkpoint", "Gate 04")
    @Column(nullable = false)
    private String gatePost;

    // Outgoing Guard Details
    @Column(nullable = false)
    private Long outgoingGuardId;

    @Column(nullable = false)
    private String outgoingGuardName;

    @Column(nullable = false)
    private String outgoingGuardBadgeNumber;

    private String outgoingGuardEmail;

    // Shift Schedule Context
    private String shiftType; // MORNING, EVENING, NIGHT, CUSTOM

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate shiftDate;

    private String shiftStartTime; // e.g. "06:00"
    private String shiftEndTime;   // e.g. "14:00"

    // Operational Handoff Notes & Physical Asset Status
    @Column(columnDefinition = "TEXT", nullable = false)
    private String handoffNotes;

    private String equipmentStatus; // e.g. "Radios (2/2) OK, Barrier Key handed over, Logbook signed"

    private String keyInventory; // e.g. "Master Keyring #4, Padlock Key B"

    // Operational Status: PENDING_ACKNOWLEDGEMENT, ACKNOWLEDGED, CANCELLED
    @Column(nullable = false)
    private String status = "PENDING_ACKNOWLEDGEMENT";

    // Acknowledgement Status Flags
    @Column(nullable = false)
    private boolean acknowledged = false;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime acknowledgedAt;

    private Long acknowledgedByGuardId;

    private String acknowledgedByGuardName;

    private String acknowledgedByGuardBadge;

    @Column(nullable = false)
    private boolean responsibilityTransferred = false;

    @Column(columnDefinition = "TEXT")
    private String acknowledgementNotes;

    // Explicit acknowledgement record link
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "acknowledgement_id")
    private ShiftHandoffAcknowledgement acknowledgement;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    public ShiftHandoff() {
        this.status = "PENDING_ACKNOWLEDGEMENT";
        this.acknowledged = false;
        this.responsibilityTransferred = false;
        this.shiftDate = LocalDate.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public ShiftHandoff(
            String gatePost,
            Long outgoingGuardId,
            String outgoingGuardName,
            String outgoingGuardBadgeNumber,
            String outgoingGuardEmail,
            String shiftType,
            LocalDate shiftDate,
            String shiftStartTime,
            String shiftEndTime,
            String handoffNotes,
            String equipmentStatus,
            String keyInventory
    ) {
        this();
        this.gatePost = gatePost;
        this.outgoingGuardId = outgoingGuardId;
        this.outgoingGuardName = outgoingGuardName;
        this.outgoingGuardBadgeNumber = outgoingGuardBadgeNumber;
        this.outgoingGuardEmail = outgoingGuardEmail;
        this.shiftType = shiftType != null ? shiftType : "MORNING";
        this.shiftDate = shiftDate != null ? shiftDate : LocalDate.now();
        this.shiftStartTime = shiftStartTime;
        this.shiftEndTime = shiftEndTime;
        this.handoffNotes = handoffNotes;
        this.equipmentStatus = equipmentStatus;
        this.keyInventory = keyInventory;
    }

    @PrePersist
    public void onPrePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
        if (this.shiftDate == null) {
            this.shiftDate = LocalDate.now();
        }
        if (this.status == null || this.status.isBlank()) {
            this.status = "PENDING_ACKNOWLEDGEMENT";
        }
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getGatePost() { return gatePost; }
    public void setGatePost(String gatePost) { this.gatePost = gatePost; }

    // Alias for compatibility with postLocation
    public String getPostLocation() { return gatePost; }
    public void setPostLocation(String postLocation) { this.gatePost = postLocation; }

    public Long getOutgoingGuardId() { return outgoingGuardId; }
    public void setOutgoingGuardId(Long outgoingGuardId) { this.outgoingGuardId = outgoingGuardId; }

    public String getOutgoingGuardName() { return outgoingGuardName; }
    public void setOutgoingGuardName(String outgoingGuardName) { this.outgoingGuardName = outgoingGuardName; }

    public String getOutgoingGuardBadgeNumber() { return outgoingGuardBadgeNumber; }
    public void setOutgoingGuardBadgeNumber(String outgoingGuardBadgeNumber) { this.outgoingGuardBadgeNumber = outgoingGuardBadgeNumber; }

    public String getOutgoingGuardEmail() { return outgoingGuardEmail; }
    public void setOutgoingGuardEmail(String outgoingGuardEmail) { this.outgoingGuardEmail = outgoingGuardEmail; }

    public String getShiftType() { return shiftType; }
    public void setShiftType(String shiftType) { this.shiftType = shiftType; }

    public LocalDate getShiftDate() { return shiftDate; }
    public void setShiftDate(LocalDate shiftDate) { this.shiftDate = shiftDate; }

    public String getShiftStartTime() { return shiftStartTime; }
    public void setShiftStartTime(String shiftStartTime) { this.shiftStartTime = shiftStartTime; }

    public String getShiftEndTime() { return shiftEndTime; }
    public void setShiftEndTime(String shiftEndTime) { this.shiftEndTime = shiftEndTime; }

    public String getHandoffNotes() { return handoffNotes; }
    public void setHandoffNotes(String handoffNotes) { this.handoffNotes = handoffNotes; }

    public String getEquipmentStatus() { return equipmentStatus; }
    public void setEquipmentStatus(String equipmentStatus) { this.equipmentStatus = equipmentStatus; }

    public String getKeyInventory() { return keyInventory; }
    public void setKeyInventory(String keyInventory) { this.keyInventory = keyInventory; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isAcknowledged() { return acknowledged; }
    public void setAcknowledged(boolean acknowledged) { this.acknowledged = acknowledged; }

    public LocalDateTime getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }

    public Long getAcknowledgedByGuardId() { return acknowledgedByGuardId; }
    public void setAcknowledgedByGuardId(Long acknowledgedByGuardId) { this.acknowledgedByGuardId = acknowledgedByGuardId; }

    public String getAcknowledgedByGuardName() { return acknowledgedByGuardName; }
    public void setAcknowledgedByGuardName(String acknowledgedByGuardName) { this.acknowledgedByGuardName = acknowledgedByGuardName; }

    public String getAcknowledgedByGuardBadge() { return acknowledgedByGuardBadge; }
    public void setAcknowledgedByGuardBadge(String acknowledgedByGuardBadge) { this.acknowledgedByGuardBadge = acknowledgedByGuardBadge; }

    public boolean isResponsibilityTransferred() { return responsibilityTransferred; }
    public void setResponsibilityTransferred(boolean responsibilityTransferred) { this.responsibilityTransferred = responsibilityTransferred; }

    public String getAcknowledgementNotes() { return acknowledgementNotes; }
    public void setAcknowledgementNotes(String acknowledgementNotes) { this.acknowledgementNotes = acknowledgementNotes; }

    public ShiftHandoffAcknowledgement getAcknowledgement() { return acknowledgement; }
    public void setAcknowledgement(ShiftHandoffAcknowledgement acknowledgement) { this.acknowledgement = acknowledgement; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
