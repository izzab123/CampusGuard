package com.campusguard.repository;

import com.campusguard.model.ScanLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScanLogRepository extends JpaRepository<ScanLog, Long> {

    List<ScanLog> findAllByOrderByScanTimestampDesc();

    @Query("SELECT s FROM ScanLog s WHERE s.scanTimestamp >= :start AND s.scanTimestamp <= :end ORDER BY s.scanTimestamp DESC")
    List<ScanLog> findByTimestampBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
