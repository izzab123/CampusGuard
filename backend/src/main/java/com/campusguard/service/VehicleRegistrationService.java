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
        reg.setQrCode("CG-QR-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());

        VehicleRegistration saved = vehicleRepo.save(reg);

        // Notify Admin ONLY of new pending registration
        Notification adminNotif = new Notification();
        adminNotif.setRecipientRole("Admin");
        adminNotif.setTitle("New Vehicle Registration Submitted");
        adminNotif.setMessage("A new vehicle registration for " + saved.getVehicleType() + " [" + saved.getVehicleNumber() + "] was submitted by student " + saved.getOwnerName() + " (ID: " + saved.getStudentId() + ", Contact: " + saved.getContactNumber() + "). Review and approval required.");
        adminNotif.setCategory("VEHICLE_REGISTRATION");
        adminNotif.setPriority("HIGH");
        adminNotif.setVehicleRegistrationId(saved.getId());
        adminNotif.setCreatedAt(LocalDateTime.now());
        adminNotif.setRead(false);
        notificationRepo.save(adminNotif);

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
        reg.setApprovedBy(approvedBy != null && !approvedBy.isBlank() ? approvedBy.trim() : "Administrator");
        VehicleRegistration updated = vehicleRepo.save(reg);

        // Sync or create active ParkingPass for automatic gate clearance
        if (parkingPassRepo.findByPlateNumber(reg.getVehicleNumber()).isEmpty()) {
            ParkingPass pass = new ParkingPass();
            pass.setPlateNumber(reg.getVehicleNumber());
            pass.setPassToken(reg.getQrCode() != null && !reg.getQrCode().isBlank()
                    ? reg.getQrCode()
                    : ("CG-PASS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()));
            pass.setZoneName("Lot C • Student Resident");
            pass.setOwnerName(reg.getOwnerName());
            pass.setOwnerType("STUDENT");
            pass.setStatus("ACTIVE");
            pass.setIssuedAt(LocalDateTime.now());
            pass.setValidUntil(LocalDateTime.now().plusMonths(6));
            parkingPassRepo.save(pass);
        }

        // Notify Student, Guard, and Shift Supervisor that vehicle registration was approved
        String approvedTitle = "Vehicle Registration Approved";
        String staffMsg = "Vehicle registration for " + reg.getVehicleNumber() + " (" + reg.getVehicleType() + ") owned by " + reg.getOwnerName() + " (Student ID: " + reg.getStudentId() + ", Contact: " + reg.getContactNumber() + ") has been approved by " + updated.getApprovedBy() + " and registered.";

        // 1. Notify Student
        Notification studentNotif = new Notification();
        studentNotif.setRecipientRole("Student");
        studentNotif.setRecipientEmail(reg.getSubmittedByEmail());
        studentNotif.setTitle(approvedTitle);
        studentNotif.setMessage("Your vehicle registration request for " + reg.getVehicleNumber() + " (" + reg.getVehicleType() + ") has been approved by campus administration. Parking pass and gate clearance are active.");
        studentNotif.setCategory("VEHICLE_REGISTRATION");
        studentNotif.setPriority("MEDIUM");
        studentNotif.setVehicleRegistrationId(updated.getId());
        studentNotif.setCreatedAt(LocalDateTime.now());
        studentNotif.setRead(false);
        notificationRepo.save(studentNotif);

        // 2. Notify Security Guard
        Notification guardNotif = new Notification();
        guardNotif.setRecipientRole("Security Guard");
        guardNotif.setTitle(approvedTitle);
        guardNotif.setMessage(staffMsg);
        guardNotif.setCategory("VEHICLE_REGISTRATION");
        guardNotif.setPriority("MEDIUM");
        guardNotif.setVehicleRegistrationId(updated.getId());
        guardNotif.setCreatedAt(LocalDateTime.now());
        guardNotif.setRead(false);
        notificationRepo.save(guardNotif);

        // 3. Notify Shift Supervisor
        Notification supervisorNotif = new Notification();
        supervisorNotif.setRecipientRole("Shift Supervisor");
        supervisorNotif.setTitle(approvedTitle);
        supervisorNotif.setMessage(staffMsg);
        supervisorNotif.setCategory("VEHICLE_REGISTRATION");
        supervisorNotif.setPriority("MEDIUM");
        supervisorNotif.setVehicleRegistrationId(updated.getId());
        supervisorNotif.setCreatedAt(LocalDateTime.now());
        supervisorNotif.setRead(false);
        notificationRepo.save(supervisorNotif);

        return updated;
    }

    @Transactional
    public VehicleRegistration denyRegistration(Long id, String reason, String deniedBy) {
        VehicleRegistration reg = vehicleRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Vehicle registration not found with ID: " + id));

        if ("Denied".equalsIgnoreCase(reg.getStatus())) {
            return reg;
        }

        if (reason == null || reason.trim().isBlank()) {
            throw new IllegalArgumentException("A reason must be provided when denying a vehicle registration request.");
        }

        reg.setStatus("Denied");
        reg.setDeniedAt(LocalDateTime.now());
        reg.setDeniedBy(deniedBy != null && !deniedBy.isBlank() ? deniedBy.trim() : "Administrator");
        reg.setRejectionReason(reason.trim());
        VehicleRegistration updated = vehicleRepo.save(reg);

        String deniedTitle = "Vehicle Registration Denied";
        String writtenReason = updated.getRejectionReason();

        // 1. Notify Student (with written reason)
        Notification studentNotif = new Notification();
        studentNotif.setRecipientRole("Student");
        studentNotif.setRecipientEmail(reg.getSubmittedByEmail());
        studentNotif.setTitle(deniedTitle);
        studentNotif.setMessage("Your request for vehicle registration for " + reg.getVehicleNumber() + " (" + reg.getVehicleType() + ") has been denied by " + updated.getDeniedBy() + ". Reason: " + writtenReason);
        studentNotif.setCategory("VEHICLE_REGISTRATION");
        studentNotif.setPriority("HIGH");
        studentNotif.setVehicleRegistrationId(updated.getId());
        studentNotif.setCreatedAt(LocalDateTime.now());
        studentNotif.setRead(false);
        notificationRepo.save(studentNotif);

        // 2. Notify Security Guard (with written reason)
        Notification guardNotif = new Notification();
        guardNotif.setRecipientRole("Security Guard");
        guardNotif.setTitle(deniedTitle);
        guardNotif.setMessage("Vehicle registration request for " + reg.getVehicleNumber() + " (" + reg.getVehicleType() + ") submitted by student " + reg.getOwnerName() + " (ID: " + reg.getStudentId() + ") has been denied by " + updated.getDeniedBy() + ". Reason: " + writtenReason);
        guardNotif.setCategory("VEHICLE_REGISTRATION");
        guardNotif.setPriority("HIGH");
        guardNotif.setVehicleRegistrationId(updated.getId());
        guardNotif.setCreatedAt(LocalDateTime.now());
        guardNotif.setRead(false);
        notificationRepo.save(guardNotif);

        // 3. Notify Shift Supervisor (with written reason)
        Notification supervisorNotif = new Notification();
        supervisorNotif.setRecipientRole("Shift Supervisor");
        supervisorNotif.setTitle(deniedTitle);
        supervisorNotif.setMessage("Vehicle registration request for " + reg.getVehicleNumber() + " (" + reg.getVehicleType() + ") submitted by student " + reg.getOwnerName() + " (ID: " + reg.getStudentId() + ") has been denied by " + updated.getDeniedBy() + ". Reason: " + writtenReason);
        supervisorNotif.setCategory("VEHICLE_REGISTRATION");
        supervisorNotif.setPriority("HIGH");
        supervisorNotif.setVehicleRegistrationId(updated.getId());
        supervisorNotif.setCreatedAt(LocalDateTime.now());
        supervisorNotif.setRead(false);
        notificationRepo.save(supervisorNotif);

        return updated;
    }

    @Transactional
    public Optional<VehicleRegistration> getById(Long id) {
        return vehicleRepo.findById(id).map(v -> {
            if (v.getQrCode() == null || v.getQrCode().isBlank()) {
                v.setQrCode("CG-QR-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());
                return vehicleRepo.save(v);
            }
            return v;
        });
    }

    @Transactional
    public List<VehicleRegistration> getMyRegistrations(String email, String studentId) {
        List<VehicleRegistration> list;
        if (email != null && !email.isBlank()) {
            list = vehicleRepo.findBySubmittedByEmailIgnoreCaseOrderByCreatedAtDesc(email.trim());
        } else if (studentId != null && !studentId.isBlank()) {
            list = vehicleRepo.findByStudentIdIgnoreCaseOrderByCreatedAtDesc(studentId.trim());
        } else {
            list = vehicleRepo.findAllByOrderByCreatedAtDesc();
        }
        for (VehicleRegistration v : list) {
            if (v.getQrCode() == null || v.getQrCode().isBlank()) {
                v.setQrCode("CG-QR-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());
                vehicleRepo.save(v);
            }
        }
        return list;
    }

    @Transactional
    public List<VehicleRegistration> getAllRegistrations(String status) {
        List<VehicleRegistration> list;
        if (status != null && !status.isBlank()) {
            list = vehicleRepo.findByStatusIgnoreCaseOrderByCreatedAtDesc(status.trim());
        } else {
            list = vehicleRepo.findAllByOrderByCreatedAtDesc();
        }
        for (VehicleRegistration v : list) {
            if (v.getQrCode() == null || v.getQrCode().isBlank()) {
                v.setQrCode("CG-QR-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());
                vehicleRepo.save(v);
            }
        }
        return list;
    }

    @Transactional(readOnly = true)
    public boolean isVehicleNumberAvailable(String vehicleNumber) {
        if (vehicleNumber == null || vehicleNumber.trim().isBlank()) {
            return false;
        }
        return !vehicleRepo.existsByVehicleNumberIgnoreCase(vehicleNumber.trim());
    }
}
