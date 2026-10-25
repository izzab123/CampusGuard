package com.campusguard.repository;

import com.campusguard.model.OccurrenceRemark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OccurrenceRemarkRepository extends JpaRepository<OccurrenceRemark, Long> {
    List<OccurrenceRemark> findByOccurrenceIdOrderByCreatedAtAsc(Long occurrenceId);
}
