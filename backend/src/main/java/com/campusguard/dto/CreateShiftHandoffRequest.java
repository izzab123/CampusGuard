package com.campusguard.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class CreateShiftHandoffRequest {

    @NotBlank(message = "Assigned gate / post location is required")
    private String gatePost;

    private Long outgoingGuardId;

    private String outgoingGuardName;

    private String outgoingGuardBadgeNumber;

    private String outgoingGuardEmail;

    private String shiftType; // MORNING, EVENING, NIGHT

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate shiftDate;

    private String shiftStartTime;

    private String shiftEndTime;

    @NotBlank(message = "Handoff notes are required")
    private String handoffNotes;

    private String equipmentStatus;

    private String keyInventory;

    public CreateShiftHandoffRequest() {}

    public CreateShiftHandoffRequest(
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
        this.gatePost = gatePost;
        this.outgoingGuardId = outgoingGuardId;
        this.outgoingGuardName = outgoingGuardName;
        this.outgoingGuardBadgeNumber = outgoingGuardBadgeNumber;
        this.outgoingGuardEmail = outgoingGuardEmail;
        this.shiftType = shiftType;
        this.shiftDate = shiftDate;
        this.shiftStartTime = shiftStartTime;
        this.shiftEndTime = shiftEndTime;
        this.handoffNotes = handoffNotes;
        this.equipmentStatus = equipmentStatus;
        this.keyInventory = keyInventory;
    }

    // Getters and Setters
    public String getGatePost() { return gatePost; }
    public void setGatePost(String gatePost) { this.gatePost = gatePost; }

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
}
