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
    private Long userId;
    private String profilePicture;
    private String profileReviewStatus;

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

    public LoginResponse(boolean success, String message, String token, String email, String role, String fullName, String badgeNumber, String department, Long userId) {
        this(success, message, token, email, role, fullName, badgeNumber, department);
        this.userId = userId;
    }

    public LoginResponse(boolean success, String message, String token, String email, String role, String fullName, String badgeNumber, String department, Long userId, String profilePicture, String profileReviewStatus) {
        this(success, message, token, email, role, fullName, badgeNumber, department, userId);
        this.profilePicture = profilePicture;
        this.profileReviewStatus = profileReviewStatus;
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

    public static LoginResponse success(String token, String email, String role, String fullName, String badgeNumber, String department, Long userId) {
        return new LoginResponse(true, "Authentication successful", token, email, role, fullName, badgeNumber, department, userId);
    }

    public static LoginResponse success(String token, String email, String role, String fullName, String badgeNumber, String department, Long userId, String profilePicture, String profileReviewStatus) {
        return new LoginResponse(true, "Authentication successful", token, email, role, fullName, badgeNumber, department, userId, profilePicture, profileReviewStatus);
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getProfileReviewStatus() {
        return profileReviewStatus;
    }

    public void setProfileReviewStatus(String profileReviewStatus) {
        this.profileReviewStatus = profileReviewStatus;
    }
}
