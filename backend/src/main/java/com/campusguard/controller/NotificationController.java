package com.campusguard.controller;

import com.campusguard.model.Notification;
import com.campusguard.repository.NotificationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepo;

    public NotificationController(NotificationRepository notificationRepo) {
        this.notificationRepo = notificationRepo;
    }

    @GetMapping
    public List<Notification> getNotifications(
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "email", required = false) String email) {
        String cleanRole = (role != null && !role.isBlank()) ? role.trim() : null;
        String cleanEmail = (email != null && !email.isBlank()) ? email.trim() : null;

        if (cleanRole != null || cleanEmail != null) {
            return notificationRepo.findForRecipient(cleanRole, cleanEmail);
        }
        return notificationRepo.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }
        Notification saved = notificationRepo.save(notification);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PostMapping("/guard-absence")
    public ResponseEntity<Notification> createGuardAbsenceNotification(@RequestBody Notification alert) {
        alert.setRecipientRole("Shift Supervisor");
        alert.setCategory("DUTY_ABSENCE");
        if (alert.getPriority() == null || alert.getPriority().isBlank()) {
            alert.setPriority("CRITICAL");
        }
        if (alert.getDutyStatus() == null || alert.getDutyStatus().isBlank()) {
            alert.setDutyStatus("NO_SHOW");
        }
        if (alert.getCreatedAt() == null) {
            alert.setCreatedAt(LocalDateTime.now());
        }
        Notification saved = notificationRepo.save(alert);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return notificationRepo.findById(id).map(notif -> {
            notif.setRead(true);
            return ResponseEntity.ok(notificationRepo.save(notif));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/unread")
    public ResponseEntity<Notification> markAsUnread(@PathVariable Long id) {
        return notificationRepo.findById(id).map(notif -> {
            notif.setRead(false);
            return ResponseEntity.ok(notificationRepo.save(notif));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-read")
    public ResponseEntity<Notification> toggleRead(@PathVariable Long id) {
        return notificationRepo.findById(id).map(notif -> {
            notif.setRead(!notif.isRead());
            return ResponseEntity.ok(notificationRepo.save(notif));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(@RequestParam(value = "role", required = false) String role) {
        List<Notification> list = (role != null && !role.isBlank())
            ? notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc(role.trim(), "ALL")
            : notificationRepo.findAll();
        for (Notification n : list) {
            n.setRead(true);
        }
        notificationRepo.saveAll(list);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        if (notificationRepo.existsById(id)) {
            notificationRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

