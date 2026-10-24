package com.campusguard.repository;

import com.campusguard.model.ShiftHandoffAcknowledgement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftHandoffAcknowledgementRepository extends JpaRepository<ShiftHandoffAcknowledgement, Long> {

    Optional<ShiftHandoffAcknowledgement> findByShiftHandoffId(Long shiftHandoffId);

    List<ShiftHandoffAcknowledgement> findByGuardIdOrderByAcknowledgedAtDesc(Long guardId);

    List<ShiftHandoffAcknowledgement> findByOutgoingGuardIdOrderByAcknowledgedAtDesc(Long outgoingGuardId);

    List<ShiftHandoffAcknowledgement> findAllByOrderByAcknowledgedAtDesc();
}
