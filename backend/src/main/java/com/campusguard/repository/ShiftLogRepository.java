package com.campusguard.repository;

import com.campusguard.model.ShiftLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftLogRepository extends JpaRepository<ShiftLog, Long> {
    List<ShiftLog> findByStatus(String status);
    List<ShiftLog> findAllByOrderByShiftStartDesc();
}
