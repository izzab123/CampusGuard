package com.campusguard.dto;

import com.campusguard.model.ShiftHandoff;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LogbookEntryResponse {

    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    private String shift;
    private String shiftHours;
    private String gate;

    // Outgoing Guard
    private String outgoingGuard;
    private Long outgoingGuardId;
    private String outgoingGuardBadge;

    // Incoming Guard
    private String incomingGuard;
    private Long incomingGuardId;
    private String incomingGuardBadge;

    // Acknowledgement Status
    private String acknowledgementStatus;
    private boolean acknowledged;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime acknowledgedAt;

    private boolean responsibilityTransferred;

    private String handoffNotes;
    private String equipmentStatus;
    private String keyInventory;

    // Strictly read-only indicator for Shift Supervisors
    private boolean readOnly = true;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    public LogbookEntryResponse() {
        this.readOnly = true;
    }

    public static LogbookEntryResponse fromShiftHandoff(ShiftHandoff h) {
        if (h == null) return null;

        LogbookEntryResponse res = new LogbookEntryResponse();
        res.setId(h.getId());
        res.setDate(h.getShiftDate());
        res.setShift(h.getShiftType());
        res.setShiftHours(
                (h.getShiftStartTime() != null ? h.getShiftStartTime() : "") +
                (h.getShiftEndTime() != null ? " - " + h.getShiftEndTime() : "")
        );
        res.setGate(h.getGatePost());

        res.setOutgoingGuard(h.getOutgoingGuardName());
        res.setOutgoingGuardId(h.getOutgoingGuardId());
        res.setOutgoingGuardBadge(h.getOutgoingGuardBadgeNumber());

        res.setIncomingGuard(h.getAcknowledgedByGuardName());
        res.setIncomingGuardId(h.getAcknowledgedByGuardId());
        res.setIncomingGuardBadge(h.getAcknowledgedByGuardBadge());

        res.setAcknowledgementStatus(h.getStatus());
        res.setAcknowledged(h.isAcknowledged());
        res.setAcknowledgedAt(h.getAcknowledgedAt());
        res.setResponsibilityTransferred(h.isResponsibilityTransferred());

        res.setHandoffNotes(h.getHandoffNotes());
        res.setEquipmentStatus(h.getEquipmentStatus());
        res.setKeyInventory(h.getKeyInventory());
        res.setCreatedAt(h.getCreatedAt());
        res.setReadOnly(true);

        return res;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }

    public String getShiftHours() { return shiftHours; }
    public void setShiftHours(String shiftHours) { this.shiftHours = shiftHours; }

    public String getGate() { return gate; }
    public void setGate(String gate) { this.gate = gate; }

    public String getOutgoingGuard() { return outgoingGuard; }
    public void setOutgoingGuard(String outgoingGuard) { this.outgoingGuard = outgoingGuard; }

    public Long getOutgoingGuardId() { return outgoingGuardId; }
    public void setOutgoingGuardId(Long outgoingGuardId) { this.outgoingGuardId = outgoingGuardId; }

    public String getOutgoingGuardBadge() { return outgoingGuardBadge; }
    public void setOutgoingGuardBadge(String outgoingGuardBadge) { this.outgoingGuardBadge = outgoingGuardBadge; }

    public String getIncomingGuard() { return incomingGuard; }
    public void setIncomingGuard(String incomingGuard) { this.incomingGuard = incomingGuard; }

    public Long getIncomingGuardId() { return incomingGuardId; }
    public void setIncomingGuardId(Long incomingGuardId) { this.incomingGuardId = incomingGuardId; }

    public String getIncomingGuardBadge() { return incomingGuardBadge; }
    public void setIncomingGuardBadge(String incomingGuardBadge) { this.incomingGuardBadge = incomingGuardBadge; }

    public String getAcknowledgementStatus() { return acknowledgementStatus; }
    public void setAcknowledgementStatus(String acknowledgementStatus) { this.acknowledgementStatus = acknowledgementStatus; }

    public boolean isAcknowledged() { return acknowledged; }
    public void setAcknowledged(boolean acknowledged) { this.acknowledged = acknowledged; }

    public LocalDateTime getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }

    public boolean isResponsibilityTransferred() { return responsibilityTransferred; }
    public void setResponsibilityTransferred(boolean responsibilityTransferred) { this.responsibilityTransferred = responsibilityTransferred; }

    public String getHandoffNotes() { return handoffNotes; }
    public void setHandoffNotes(String handoffNotes) { this.handoffNotes = handoffNotes; }

    public String getEquipmentStatus() { return equipmentStatus; }
    public void setEquipmentStatus(String equipmentStatus) { this.equipmentStatus = equipmentStatus; }

    public String getKeyInventory() { return keyInventory; }
    public void setKeyInventory(String keyInventory) { this.keyInventory = keyInventory; }

    public boolean isReadOnly() { return readOnly; }
    public void setReadOnly(boolean readOnly) { this.readOnly = readOnly; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
