package com.campusguard.repository;

import com.campusguard.model.AttendanceConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceConfigRepository extends JpaRepository<AttendanceConfig, Long> {
}
