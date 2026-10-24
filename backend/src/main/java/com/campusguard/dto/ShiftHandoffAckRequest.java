package com.campusguard.dto;

import jakarta.validation.constraints.NotNull;

public class ShiftHandoffAckRequest {

    private Long guardId; // ID of the incoming guard accepting responsibility

    private String guardBadgeNumber;

    private String guardName;

    private String guardEmail;

    private String notes; // Acknowledgement notes (e.g., "Keys verified, post taken over")

    public ShiftHandoffAckRequest() {}

    public ShiftHandoffAckRequest(Long guardId, String guardBadgeNumber, String guardName, String guardEmail, String notes) {
        this.guardId = guardId;
        this.guardBadgeNumber = guardBadgeNumber;
        this.guardName = guardName;
        this.guardEmail = guardEmail;
        this.notes = notes;
    }

    public Long getGuardId() { return guardId; }
    public void setGuardId(Long guardId) { this.guardId = guardId; }

    public String getGuardBadgeNumber() { return guardBadgeNumber; }
    public void setGuardBadgeNumber(String guardBadgeNumber) { this.guardBadgeNumber = guardBadgeNumber; }

    public String getGuardName() { return guardName; }
    public void setGuardName(String guardName) { this.guardName = guardName; }

    public String getGuardEmail() { return guardEmail; }
    public void setGuardEmail(String guardEmail) { this.guardEmail = guardEmail; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
