package com.campusguard.service;

import com.campusguard.model.OccurrenceRecord;
import com.campusguard.model.OccurrenceRemark;
import com.campusguard.repository.OccurrenceRecordRepository;
import com.campusguard.repository.OccurrenceRemarkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
public class OccurrenceRegisterService {

    private final OccurrenceRecordRepository recordRepository;
    private final OccurrenceRemarkRepository remarkRepository;

    public OccurrenceRegisterService(OccurrenceRecordRepository recordRepository, OccurrenceRemarkRepository remarkRepository) {
        this.recordRepository = recordRepository;
        this.remarkRepository = remarkRepository;
    }

    @Transactional(readOnly = true)
    public List<OccurrenceRecord> searchOccurrences(
            LocalDate startDate,
            LocalDate endDate,
            String guard,
            String type
    ) {
        List<OccurrenceRecord> list;

        if (startDate != null && endDate != null) {
            list = recordRepository.findByOccurrenceDateBetweenOrderByOccurrenceDateDescCreatedAtDesc(startDate, endDate);
        } else if (startDate != null) {
            list = recordRepository.findByOccurrenceDateBetweenOrderByOccurrenceDateDescCreatedAtDesc(startDate, LocalDate.now().plusYears(1));
        } else if (endDate != null) {
            list = recordRepository.findByOccurrenceDateBetweenOrderByOccurrenceDateDescCreatedAtDesc(LocalDate.of(2000, 1, 1), endDate);
        } else {
            list = recordRepository.findAllByOrderByOccurrenceDateDescCreatedAtDesc();
        }

        return list.stream()
                .filter(record -> {
                    // Guard filter (matches guard name or badge)
                    if (guard != null && !guard.isBlank()) {
                        String q = guard.trim().toLowerCase();
                        boolean nameMatch = record.getGuardName() != null && record.getGuardName().toLowerCase().contains(q);
                        boolean badgeMatch = record.getGuardBadgeNumber() != null && record.getGuardBadgeNumber().toLowerCase().contains(q);
                        if (!nameMatch && !badgeMatch) {
                            return false;
                        }
                    }

                    // Occurrence Type filter
                    if (type != null && !type.isBlank() && !type.equalsIgnoreCase("ALL")) {
                        String t = type.trim().toUpperCase().replace(" ", "_");
                        String recordType = record.getOccurrenceType() != null ? record.getOccurrenceType().toUpperCase().replace(" ", "_") : "";
                        if (!recordType.equals(t) && !recordType.contains(t)) {
                            return false;
                        }
                    }

                    return true;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OccurrenceRecord getOccurrenceDetails(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Occurrence ID cannot be null");
        }
        return recordRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Occurrence record not found with ID: " + id));
    }

    public OccurrenceRecord appendRemark(
            Long occurrenceId,
            String authorName,
            String authorBadge,
            String authorRole,
            String authorEmail,
            String remarkText
    ) {
        if (occurrenceId == null) {
            throw new IllegalArgumentException("Occurrence ID cannot be null");
        }
        if (remarkText == null || remarkText.trim().isBlank()) {
            throw new IllegalArgumentException("Remark text cannot be empty");
        }

        OccurrenceRecord record = getOccurrenceDetails(occurrenceId);

        String safeAuthor = authorName != null && !authorName.isBlank() ? authorName.trim() : "Shift Supervisor";
        String safeRole = authorRole != null && !authorRole.isBlank() ? authorRole.trim() : "Shift Supervisor";

        OccurrenceRemark remark = new OccurrenceRemark(
                record.getId(),
                safeAuthor,
                authorBadge,
                safeRole,
                authorEmail,
                remarkText.trim()
        );
        remark.setCreatedAt(LocalDateTime.now());

        record.addRemark(remark);
        return recordRepository.save(record);
    }

    public OccurrenceRecord saveRecord(OccurrenceRecord record) {
        return recordRepository.save(record);
    }

    public long count() {
        return recordRepository.count();
    }
}
