package com.campusguard.repository;

import com.campusguard.model.ShiftHandoffForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftHandoffFormRepository extends JpaRepository<ShiftHandoffForm, Long> {

    List<ShiftHandoffForm> findAllByOrderByTimestampDesc();

    List<ShiftHandoffForm> findByOutgoingGuardIdOrderByTimestampDesc(String outgoingGuardId);

    List<ShiftHandoffForm> findByPostLocationOrderByTimestampDesc(String postLocation);
}
