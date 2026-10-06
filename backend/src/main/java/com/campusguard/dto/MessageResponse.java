package com.campusguard.dto;

public class MessageResponse {

    private boolean success;
    private String message;
    private String resetUrl; // Provided for convenience in dev/test

    public MessageResponse() {}

    public MessageResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public MessageResponse(boolean success, String message, String resetUrl) {
        this.success = success;
        this.message = message;
        this.resetUrl = resetUrl;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getResetUrl() {
        return resetUrl;
    }

    public void setResetUrl(String resetUrl) {
        this.resetUrl = resetUrl;
    }
}
