package com.campusguard.repository;

import com.campusguard.model.ProfileChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileChangeRequestRepository extends JpaRepository<ProfileChangeRequest, Long> {
    List<ProfileChangeRequest> findAllByOrderByCreatedAtDesc();
    List<ProfileChangeRequest> findByStatusOrderByCreatedAtDesc(String status);
    List<ProfileChangeRequest> findByStudentEmailOrderByCreatedAtDesc(String studentEmail);
}
