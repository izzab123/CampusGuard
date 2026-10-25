package com.campusguard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class VehicleRegistrationRequest {

    @NotBlank(message = "Student ID is required")
    @Size(min = 2, max = 50, message = "Student ID must be between 2 and 50 characters")
    private String studentId;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[+0-9\\s\\-().]{7,25}$", message = "Please provide a valid contact number (at least 7 digits)")
    private String contactNumber;

    @NotBlank(message = "Vehicle number is required")
    @Size(min = 2, max = 50, message = "Vehicle number must be between 2 and 50 characters")
    private String vehicleNumber;

    @NotBlank(message = "Vehicle type is required")
    private String vehicleType;

    private String email;

    public VehicleRegistrationRequest() {}

    public VehicleRegistrationRequest(String studentId, String name, String contactNumber, String vehicleNumber, String vehicleType, String email) {
        this.studentId = studentId;
        this.name = name;
        this.contactNumber = contactNumber;
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.email = email;
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
