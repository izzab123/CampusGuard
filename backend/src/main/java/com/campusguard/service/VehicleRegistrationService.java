package com.campusguard.service;

import com.campusguard.dto.VehicleRegistrationRequest;
import com.campusguard.model.Notification;
import com.campusguard.model.ParkingPass;
import com.campusguard.model.VehicleRegistration;
import com.campusguard.repository.NotificationRepository;
import com.campusguard.repository.ParkingPassRepository;
import com.campusguard.repository.VehicleRegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class VehicleRegistrationService {

    private final VehicleRegistrationRepository vehicleRepo;
    private final NotificationRepository notificationRepo;
    private final ParkingPassRepository parkingPassRepo;

    public VehicleRegistrationService(VehicleRegistrationRepository vehicleRepo,
                                      NotificationRepository notificationRepo,
                                      ParkingPassRepository parkingPassRepo) {
        this.vehicleRepo = vehicleRepo;
        this.notificationRepo = notificationRepo;
        this.parkingPassRepo = parkingPassRepo;
    }

    @Transactional
    public VehicleRegistration registerVehicle(VehicleRegistrationRequest req) {
        if (req.getVehicleNumber() == null || req.getVehicleNumber().trim().isBlank()) {
            throw new IllegalArgumentException("Vehicle number is required");
        }
        if (req.getStudentId() == null || req.getStudentId().trim().isBlank()) {
            throw new IllegalArgumentException("Student ID is required");
        }
        if (req.getName() == null || req.getName().trim().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (req.getContactNumber() == null || req.getContactNumber().trim().isBlank()) {
            throw new IllegalArgumentException("Contact number is required");
        }
        if (req.getVehicleType() == null || req.getVehicleType().trim().isBlank()) {
            throw new IllegalArgumentException("Vehicle type is required");
        }

        String normalizedPlate = req.getVehicleNumber().trim().toUpperCase();

        // Enforce uniqueness constraint
        if (vehicleRepo.existsByVehicleNumberIgnoreCase(normalizedPlate)) {
            throw new IllegalArgumentException("The same vehicle number cannot be registered twice. Vehicle '" + normalizedPlate + "' is already registered.");
        }

        VehicleRegistration reg = new VehicleRegistration();
        reg.setStudentId(req.getStudentId().trim());
        reg.setOwnerName(req.getName().trim());
        reg.setContactNumber(req.getContactNumber().trim());
        reg.setVehicleNumber(normalizedPlate);
        reg.setVehicleType(req.getVehicleType().trim());
        reg.setSubmittedByEmail(req.getEmail() != null ? req.getEmail().trim() : null);
        reg.setStatus("Pending approval");
        reg.setCreatedAt(LocalDateTime.now());

        VehicleRegistration saved = vehicleRepo.save(reg);

        // Notify Security Guard of new pending registration
        Notification guardNotif = new Notification();
        guardNotif.setRecipientRole("Security Guard");
        guardNotif.setTitle("New Vehicle Registration Submitted");
        guardNotif.setMessage("A new vehicle registration for " + saved.getVehicleType() + " [" + saved.getVehicleNumber() + "] was submitted by student " + saved.getOwnerName() + " (ID: " + saved.getStudentId() + ", Contact: " + saved.getContactNumber() + "). Approval required.");
        guardNotif.setCategory("VEHICLE_REGISTRATION");
        guardNotif.setPriority("MEDIUM");
        guardNotif.setVehicleRegistrationId(saved.getId());
        guardNotif.setCreatedAt(LocalDateTime.now());
        guardNotif.setRead(false);
        notificationRepo.save(guardNotif);

        return saved;
    }

    @Transactional
    public VehicleRegistration approveRegistration(Long id, String approvedBy) {
        VehicleRegistration reg = vehicleRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Vehicle registration not found with ID: " + id));

        if ("Approved".equalsIgnoreCase(reg.getStatus())) {
            return reg;
        }

        reg.setStatus("Approved");
        reg.setApprovedAt(LocalDateTime.now());
        reg.setApprovedBy(approvedBy != null && !approvedBy.isBlank() ? approvedBy.trim() : "Security Guard");
        VehicleRegistration updated = vehicleRepo.save(reg);

        // Sync or create active ParkingPass for automatic gate clearance
        if (parkingPassRepo.findByPlateNumber(reg.getVehicleNumber()).isEmpty()) {
            ParkingPass pass = new ParkingPass();
            pass.setPlateNumber(reg.getVehicleNumber());
            pass.setPassToken("CG-PASS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            pass.setZoneName("Lot C • Student Resident");
            pass.setOwnerName(reg.getOwnerName());
            pass.setOwnerType("STUDENT");
            pass.setStatus("ACTIVE");
            pass.setIssuedAt(LocalDateTime.now());
            pass.setValidUntil(LocalDateTime.now().plusMonths(6));
            parkingPassRepo.save(pass);
        }

        // Notify Student, Shift Supervisor, and Admin that vehicle registration was successful
        String successTitle = "Vehicle Registration Successful";
        String adminMsg = "Vehicle " + reg.getVehicleNumber() + " (" + reg.getVehicleType() + ") owned by " + reg.getOwnerName() + " (Student ID: " + reg.getStudentId() + ", Contact: " + reg.getContactNumber() + ") has been approved by " + updated.getApprovedBy() + " and registered.";

        // 1. Notify Student
        Notification studentNotif = new Notification();
        studentNotif.setRecipientRole("Student");
        studentNotif.setRecipientEmail(reg.getSubmittedByEmail());
        studentNotif.setTitle(successTitle);
        studentNotif.setMessage("Your vehicle registration request for " + reg.getVehicleNumber() + " (" + reg.getVehicleType() + ") has been approved by campus security. Parking pass and gate clearance are active.");
        studentNotif.setCategory("VEHICLE_REGISTRATION");
        studentNotif.setPriority("MEDIUM");
        studentNotif.setVehicleRegistrationId(updated.getId());
        studentNotif.setCreatedAt(LocalDateTime.now());
        studentNotif.setRead(false);
        notificationRepo.save(studentNotif);

        // 2. Notify Shift Supervisor
        Notification supervisorNotif = new Notification();
        supervisorNotif.setRecipientRole("Shift Supervisor");
        supervisorNotif.setTitle(successTitle);
        supervisorNotif.setMessage(adminMsg);
        supervisorNotif.setCategory("VEHICLE_REGISTRATION");
        supervisorNotif.setPriority("MEDIUM");
        supervisorNotif.setVehicleRegistrationId(updated.getId());
        supervisorNotif.setCreatedAt(LocalDateTime.now());
        supervisorNotif.setRead(false);
        notificationRepo.save(supervisorNotif);

        // 3. Notify Admin
        Notification adminNotif = new Notification();
        adminNotif.setRecipientRole("Admin");
        adminNotif.setTitle(successTitle);
        adminNotif.setMessage(adminMsg);
        adminNotif.setCategory("VEHICLE_REGISTRATION");
        adminNotif.setPriority("MEDIUM");
        adminNotif.setVehicleRegistrationId(updated.getId());
        adminNotif.setCreatedAt(LocalDateTime.now());
        adminNotif.setRead(false);
        notificationRepo.save(adminNotif);

        return updated;
    }

    @Transactional
    public VehicleRegistration denyRegistration(Long id, String reason, String deniedBy) {
        VehicleRegistration reg = vehicleRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Vehicle registration not found with ID: " + id));

        if ("Denied".equalsIgnoreCase(reg.getStatus())) {
            return reg;
        }

        reg.setStatus("Denied");
        reg.setDeniedAt(LocalDateTime.now());
        reg.setDeniedBy(deniedBy != null && !deniedBy.isBlank() ? deniedBy.trim() : "Security Guard");
        reg.setRejectionReason(reason != null && !reason.isBlank() ? reason.trim() : "Clearance denied by campus security");
        VehicleRegistration updated = vehicleRepo.save(reg);

        // Notify ONLY the student that vehicle registration request has been denied
        Notification studentNotif = new Notification();
        studentNotif.setRecipientRole("Student");
        studentNotif.setRecipientEmail(reg.getSubmittedByEmail());
        studentNotif.setTitle("Vehicle Registration Denied");
        String reasonSuffix = (reg.getRejectionReason() != null && !reg.getRejectionReason().isBlank())
                ? " Reason: " + reg.getRejectionReason()
                : "";
        studentNotif.setMessage("Your request of vehicle registration for " + reg.getVehicleNumber() + " (" + reg.getVehicleType() + ") has been denied." + reasonSuffix);
        studentNotif.setCategory("VEHICLE_REGISTRATION");
        studentNotif.setPriority("HIGH");
        studentNotif.setVehicleRegistrationId(updated.getId());
        studentNotif.setCreatedAt(LocalDateTime.now());
        studentNotif.setRead(false);
        notificationRepo.save(studentNotif);

        return updated;
    }

    @Transactional(readOnly = true)
    public Optional<VehicleRegistration> getById(Long id) {
        return vehicleRepo.findById(id);
    }

    @Transactional(readOnly = true)
    public List<VehicleRegistration> getMyRegistrations(String email, String studentId) {
        if (email != null && !email.isBlank()) {
            return vehicleRepo.findBySubmittedByEmailIgnoreCaseOrderByCreatedAtDesc(email.trim());
        }
        if (studentId != null && !studentId.isBlank()) {
            return vehicleRepo.findByStudentIdIgnoreCaseOrderByCreatedAtDesc(studentId.trim());
        }
        return vehicleRepo.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<VehicleRegistration> getAllRegistrations(String status) {
        if (status != null && !status.isBlank()) {
            return vehicleRepo.findByStatusIgnoreCaseOrderByCreatedAtDesc(status.trim());
        }
        return vehicleRepo.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public boolean isVehicleNumberAvailable(String vehicleNumber) {
        if (vehicleNumber == null || vehicleNumber.trim().isBlank()) {
            return false;
        }
        return !vehicleRepo.existsByVehicleNumberIgnoreCase(vehicleNumber.trim());
    }
}
