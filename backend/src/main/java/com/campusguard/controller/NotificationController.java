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
    public List<Notification> getNotifications(@RequestParam(value = "role", required = false) String role) {
        if (role != null && !role.isBlank()) {
            return notificationRepo.findByRecipientRoleOrRecipientRoleOrderByCreatedAtDesc(role.trim(), "ALL");
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

    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return notificationRepo.findById(id).map(notif -> {
            notif.setRead(true);
            return ResponseEntity.ok(notificationRepo.save(notif));
        }).orElse(ResponseEntity.notFound().build());
    }
}
