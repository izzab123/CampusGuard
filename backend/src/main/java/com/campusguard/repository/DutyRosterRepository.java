package com.campusguard.repository;

import com.campusguard.model.DutyRoster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DutyRosterRepository extends JpaRepository<DutyRoster, Long> {

    List<DutyRoster> findAllByOrderByDutyDateDescStartTimeAsc();

    List<DutyRoster> findByDutyDateOrderByStartTimeAsc(LocalDate dutyDate);

    List<DutyRoster> findByStatusIgnoreCase(String status);

    List<DutyRoster> findByPostLocationIgnoreCase(String postLocation);

    List<DutyRoster> findBySupervisorNameIgnoreCase(String supervisorName);

    List<DutyRoster> findBySupervisorBadgeNumber(String supervisorBadgeNumber);

    List<DutyRoster> findByGuardBadgeNumber(String guardBadgeNumber);

    List<DutyRoster> findByRelieverBadgeNumber(String relieverBadgeNumber);

    long countByDutyDate(LocalDate dutyDate);

    long countByStatus(String status);

    @Query("SELECT COUNT(r) FROM DutyRoster r WHERE r.relieverName IS NOT NULL AND TRIM(r.relieverName) != ''")
    long countRelieversAssigned();

    @Query("SELECT r FROM DutyRoster r WHERE " +
           "(:dutyDate IS NULL OR r.dutyDate = :dutyDate) AND " +
           "(:status IS NULL OR LOWER(r.status) = LOWER(:status)) AND " +
           "(:postLocation IS NULL OR LOWER(r.postLocation) LIKE LOWER(CONCAT('%', :postLocation, '%'))) AND " +
           "(:supervisor IS NULL OR LOWER(r.supervisorName) LIKE LOWER(CONCAT('%', :supervisor, '%')) OR LOWER(r.supervisorBadgeNumber) = LOWER(:supervisor)) AND " +
           "(:guard IS NULL OR LOWER(r.guardName) LIKE LOWER(CONCAT('%', :guard, '%')) OR LOWER(r.guardBadgeNumber) = LOWER(:guard)) " +
           "ORDER BY r.dutyDate DESC, r.startTime ASC")
    List<DutyRoster> searchRoster(
            @Param("dutyDate") LocalDate dutyDate,
            @Param("status") String status,
            @Param("postLocation") String postLocation,
            @Param("supervisor") String supervisor,
            @Param("guard") String guard
    );
}
