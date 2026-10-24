package com.campusguard.repository;

import com.campusguard.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByOrderByCreatedAtDesc();
    List<Notification> findByRecipientRoleOrRecipientRoleOrderByCreatedAtDesc(String role, String all);
    List<Notification> findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc(String role, String all);
    List<Notification> findByCategoryIgnoreCaseOrderByCreatedAtDesc(String category);

    @org.springframework.data.jpa.repository.Query("SELECT n FROM Notification n WHERE " +
           "((:role IS NOT NULL AND (LOWER(n.recipientRole) = LOWER(:role) OR LOWER(n.recipientRole) = 'all')) " +
           " AND (n.recipientEmail IS NULL OR n.recipientEmail = '' OR (:email IS NOT NULL AND LOWER(n.recipientEmail) = LOWER(:email)))) " +
           "OR (:email IS NOT NULL AND LOWER(n.recipientEmail) = LOWER(:email)) " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findForRecipient(
        @org.springframework.data.repository.query.Param("role") String role,
        @org.springframework.data.repository.query.Param("email") String email
    );
}

