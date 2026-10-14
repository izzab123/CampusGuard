package com.campusguard.dto;

public class DutyReassignmentRequest {

    private String replacementGuardName;
    private String replacementGuardBadgeNumber;
    private String replacementGuardEmail;
    private String reason;
    private String supervisorName;
    private String supervisorBadgeNumber;
    private String notes;

    public DutyReassignmentRequest() {}

    public DutyReassignmentRequest(
            String replacementGuardName,
            String replacementGuardBadgeNumber,
            String replacementGuardEmail,
            String reason) {
        this.replacementGuardName = replacementGuardName;
        this.replacementGuardBadgeNumber = replacementGuardBadgeNumber;
        this.replacementGuardEmail = replacementGuardEmail;
        this.reason = reason;
    }

    public String getReplacementGuardName() { return replacementGuardName; }
    public void setReplacementGuardName(String replacementGuardName) { this.replacementGuardName = replacementGuardName; }

    public String getReplacementGuardBadgeNumber() { return replacementGuardBadgeNumber; }
    public void setReplacementGuardBadgeNumber(String replacementGuardBadgeNumber) { this.replacementGuardBadgeNumber = replacementGuardBadgeNumber; }

    public String getReplacementGuardEmail() { return replacementGuardEmail; }
    public void setReplacementGuardEmail(String replacementGuardEmail) { this.replacementGuardEmail = replacementGuardEmail; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getSupervisorName() { return supervisorName; }
    public void setSupervisorName(String supervisorName) { this.supervisorName = supervisorName; }

    public String getSupervisorBadgeNumber() { return supervisorBadgeNumber; }
    public void setSupervisorBadgeNumber(String supervisorBadgeNumber) { this.supervisorBadgeNumber = supervisorBadgeNumber; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
