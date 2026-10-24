package com.campusguard.repository;

import com.campusguard.model.ShiftHandoff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftHandoffRepository extends JpaRepository<ShiftHandoff, Long> {

    // Retrieve the latest shift handoff for a given gate/post location
    Optional<ShiftHandoff> findFirstByGatePostIgnoreCaseOrderByCreatedAtDesc(String gatePost);

    // Retrieve the latest pending shift handoff for a given gate/post location
    Optional<ShiftHandoff> findFirstByGatePostIgnoreCaseAndStatusOrderByCreatedAtDesc(String gatePost, String status);

    List<ShiftHandoff> findByGatePostIgnoreCaseOrderByCreatedAtDesc(String gatePost);

    List<ShiftHandoff> findByOutgoingGuardIdOrderByCreatedAtDesc(Long outgoingGuardId);

    List<ShiftHandoff> findByOutgoingGuardBadgeNumberOrderByCreatedAtDesc(String outgoingGuardBadgeNumber);

    List<ShiftHandoff> findByAcknowledgedByGuardIdOrderByCreatedAtDesc(Long acknowledgedByGuardId);

    List<ShiftHandoff> findAllByOrderByCreatedAtDesc();

    List<ShiftHandoff> findByStatusOrderByCreatedAtDesc(String status);

    @Query("SELECT h FROM ShiftHandoff h WHERE " +
           "(:gatePost IS NULL OR LOWER(h.gatePost) LIKE LOWER(CONCAT('%', :gatePost, '%'))) AND " +
           "(:status IS NULL OR LOWER(h.status) = LOWER(:status)) AND " +
           "(:outgoingGuardId IS NULL OR h.outgoingGuardId = :outgoingGuardId) AND " +
           "(:acknowledged IS NULL OR h.acknowledged = :acknowledged) " +
           "ORDER BY h.createdAt DESC")
    List<ShiftHandoff> searchHandoffs(
            @Param("gatePost") String gatePost,
            @Param("status") String status,
            @Param("outgoingGuardId") Long outgoingGuardId,
            @Param("acknowledged") Boolean acknowledged
    );
}
