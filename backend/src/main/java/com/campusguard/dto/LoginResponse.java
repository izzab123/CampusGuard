package com.campusguard.dto;

public class LoginResponse {

    private boolean success;
    private String message;
    private String token;
    private String email;
    private String role;
    private String fullName;
    private String badgeNumber;
    private String department;

    public LoginResponse() {}

    public LoginResponse(boolean success, String message, String token, String email, String role, String fullName, String badgeNumber, String department) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
        this.badgeNumber = badgeNumber;
        this.department = department;
    }

    public static LoginResponse failure(String message) {
        LoginResponse res = new LoginResponse();
        res.setSuccess(false);
        res.setMessage(message);
        return res;
    }

    public static LoginResponse success(String token, String email, String role, String fullName, String badgeNumber, String department) {
        return new LoginResponse(true, "Authentication successful", token, email, role, fullName, badgeNumber, department);
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getBadgeNumber() {
        return badgeNumber;
    }

    public void setBadgeNumber(String badgeNumber) {
        this.badgeNumber = badgeNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
