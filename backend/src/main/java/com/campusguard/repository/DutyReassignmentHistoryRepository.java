package com.campusguard.repository;

import com.campusguard.model.DutyReassignmentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DutyReassignmentHistoryRepository extends JpaRepository<DutyReassignmentHistory, Long> {

    List<DutyReassignmentHistory> findAllByOrderByReassignedAtDesc();

    List<DutyReassignmentHistory> findByDutyRosterIdOrderByReassignedAtDesc(Long dutyRosterId);

    List<DutyReassignmentHistory> findByOriginalGuardBadgeNumberOrOriginalGuardEmailOrderByReassignedAtDesc(
            String originalGuardBadgeNumber, String originalGuardEmail);

    List<DutyReassignmentHistory> findByReplacementGuardBadgeNumberOrReplacementGuardEmailOrderByReassignedAtDesc(
            String replacementGuardBadgeNumber, String replacementGuardEmail);
}
