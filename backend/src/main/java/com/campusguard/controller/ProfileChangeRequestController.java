package com.campusguard.controller;

import com.campusguard.model.Notification;
import com.campusguard.model.ProfileChangeRequest;
import com.campusguard.model.User;
import com.campusguard.repository.NotificationRepository;
import com.campusguard.repository.ProfileChangeRequestRepository;
import com.campusguard.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile-requests")
public class ProfileChangeRequestController {

    private final ProfileChangeRequestRepository profileRequestRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public ProfileChangeRequestController(ProfileChangeRequestRepository profileRequestRepository,
                                          UserRepository userRepository,
                                          NotificationRepository notificationRepository) {
        this.profileRequestRepository = profileRequestRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    /**
     * List all profile change requests, optionally filtered by status (PENDING, APPROVED, DENIED)
     */
    @GetMapping
    public List<ProfileChangeRequest> getRequests(@RequestParam(value = "status", required = false) String status) {
        if (status != null && !status.isBlank()) {
            return profileRequestRepository.findByStatusOrderByCreatedAtDesc(status.trim().toUpperCase());
        }
        return profileRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Get single profile change request by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getRequestById(@PathVariable Long id) {
        return profileRequestRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Request not found")));
    }

    /**
     * Admin approves student's profile change request
     */
    @PatchMapping("/{id}/approve")
    @Transactional
    public ResponseEntity<?> approveRequest(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        Optional<ProfileChangeRequest> opt = profileRequestRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Request not found"));
        }

        ProfileChangeRequest req = opt.get();
        String approver = (body != null && body.containsKey("approvedBy") && !body.get("approvedBy").isBlank())
                ? body.get("approvedBy").trim()
                : "Institutional Administrator";

        req.setStatus("APPROVED");
        req.setReviewedBy(approver);
        req.setReviewedAt(LocalDateTime.now());
        profileRequestRepository.save(req);

        // Update user status
        Optional<User> userOpt = (req.getUserId() != null)
                ? userRepository.findById(req.getUserId())
                : userRepository.findByEmailIgnoreCase(req.getStudentEmail());

        userOpt.ifPresent(u -> {
            u.setProfileReviewStatus("APPROVED");
            userRepository.save(u);
        });

        // Notify Student
        Notification studentNotif = new Notification(
                "Student",
                req.getStudentEmail(),
                "Profile Update Approved",
                "Your profile update request (Name: '" + req.getNewFullName() + "') has been officially reviewed and approved by " + approver + ".",
                "PROFILE_UPDATE",
                "LOW"
        );
        studentNotif.setProfileRequestId(req.getId());
        notificationRepository.save(studentNotif);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Profile change request approved successfully.",
                "request", req
        ));
    }

    /**
     * Admin denies student's profile change request with required reason
     * Whatever the student changed is reverted to previous values
     */
    @PatchMapping("/{id}/deny")
    @Transactional
    public ResponseEntity<?> denyRequest(@PathVariable Long id, @RequestBody Map<String, String> body) {
        if (body == null || !body.containsKey("reason") || body.get("reason") == null || body.get("reason").trim().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "A specific reason for denial is mandatory."));
        }

        String reason = body.get("reason").trim();
        String denier = (body.containsKey("deniedBy") && !body.get("deniedBy").isBlank())
                ? body.get("deniedBy").trim()
                : "Institutional Administrator";

        Optional<ProfileChangeRequest> opt = profileRequestRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Request not found"));
        }

        ProfileChangeRequest req = opt.get();
        req.setStatus("DENIED");
        req.setDenialReason(reason);
        req.setReviewedBy(denier);
        req.setReviewedAt(LocalDateTime.now());
        profileRequestRepository.save(req);

        // Revert student's User record back to previous values
        Optional<User> userOpt = (req.getUserId() != null)
                ? userRepository.findById(req.getUserId())
                : userRepository.findByEmailIgnoreCase(req.getStudentEmail());

        if (userOpt.isPresent()) {
            User u = userOpt.get();
            if (req.getPreviousFullName() != null) {
                u.setFullName(req.getPreviousFullName());
            }
            u.setProfilePicture(req.getPreviousProfilePicture());
            u.setProfileReviewStatus("DENIED");
            userRepository.save(u);
        }

        // Send notification to the student with denial reason
        Notification studentNotif = new Notification(
                "Student",
                req.getStudentEmail(),
                "Profile Update Denied",
                "Your profile update request was reviewed and denied by " + denier + ". Reason: " + reason + ". Your profile has been restored to your previous details.",
                "PROFILE_UPDATE",
                "HIGH"
        );
        studentNotif.setProfileRequestId(req.getId());
        notificationRepository.save(studentNotif);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Profile change request denied. Student profile details reverted.",
                "request", req
        ));
    }
}
