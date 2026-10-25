package com.campusguard.repository;

import com.campusguard.model.OccurrenceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OccurrenceRecordRepository extends JpaRepository<OccurrenceRecord, Long> {

    List<OccurrenceRecord> findAllByOrderByOccurrenceDateDescCreatedAtDesc();

    List<OccurrenceRecord> findByOccurrenceDateBetweenOrderByOccurrenceDateDescCreatedAtDesc(LocalDate start, LocalDate end);

    List<OccurrenceRecord> findByOccurrenceTypeIgnoreCaseOrderByOccurrenceDateDescCreatedAtDesc(String type);
}
