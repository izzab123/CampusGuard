package com.campusguard.service;

import com.campusguard.model.DutyRoster;
import com.campusguard.repository.DutyRosterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class DutyRosterService {

    private final DutyRosterRepository dutyRosterRepo;

    public DutyRosterService(DutyRosterRepository dutyRosterRepo) {
        this.dutyRosterRepo = dutyRosterRepo;
    }

    public DutyRoster createShiftSchedule(DutyRoster roster, String supervisorNameHeader, String supervisorBadgeHeader) {
        if (roster == null) {
            throw new IllegalArgumentException("Duty roster shift schedule data cannot be null");
        }

        // Apply supervisor metadata if provided in HTTP headers and not specified in body
        if (supervisorNameHeader != null && !supervisorNameHeader.isBlank() && 
            (roster.getSupervisorName() == null || roster.getSupervisorName().isBlank())) {
            roster.setSupervisorName(supervisorNameHeader.trim());
        } else if (roster.getSupervisorName() == null || roster.getSupervisorName().isBlank()) {
            roster.setSupervisorName("Shift Supervisor");
        }

        if (supervisorBadgeHeader != null && !supervisorBadgeHeader.isBlank() && 
            (roster.getSupervisorBadgeNumber() == null || roster.getSupervisorBadgeNumber().isBlank())) {
            roster.setSupervisorBadgeNumber(supervisorBadgeHeader.trim());
        }

        // Validate mandatory schedule requirements
        if (roster.getGuardName() == null || roster.getGuardName().isBlank()) {
            throw new IllegalArgumentException("Primary guard name is required to schedule a shift");
        }
        if (roster.getGuardBadgeNumber() == null || roster.getGuardBadgeNumber().isBlank()) {
            throw new IllegalArgumentException("Primary guard badge number is required to schedule a shift");
        }
        if (roster.getPostLocation() == null || roster.getPostLocation().isBlank()) {
            throw new IllegalArgumentException("Post location is required to schedule a shift");
        }

        // Set date default if absent
        if (roster.getDutyDate() == null) {
            roster.setDutyDate(LocalDate.now());
        }

        // Default shift type and timing if not provided
        if (roster.getShiftType() == null || roster.getShiftType().isBlank()) {
            roster.setShiftType("MORNING");
        }

        if ((roster.getStartTime() == null || roster.getStartTime().isBlank()) &&
            (roster.getEndTime() == null || roster.getEndTime().isBlank())) {
            applyDefaultTimingForShiftType(roster);
        }

        // Reliever assignment status handling
        if (roster.getRelieverName() != null && !roster.getRelieverName().isBlank()) {
            if (roster.getRelieverStatus() == null || roster.getRelieverStatus().isBlank() || 
                "NOT_ASSIGNED".equalsIgnoreCase(roster.getRelieverStatus())) {
                roster.setRelieverStatus("ASSIGNED");
            }
        } else {
            roster.setRelieverStatus("NOT_ASSIGNED");
        }

        if (roster.getStatus() == null || roster.getStatus().isBlank()) {
            roster.setStatus("SCHEDULED");
        }

        roster.setCreatedAt(LocalDateTime.now());
        roster.setUpdatedAt(LocalDateTime.now());

        return dutyRosterRepo.save(roster);
    }

    public List<DutyRoster> createBatchShiftSchedule(List<DutyRoster> rosters, String supervisorNameHeader, String supervisorBadgeHeader) {
        if (rosters == null || rosters.isEmpty()) {
            return Collections.emptyList();
        }
        List<DutyRoster> saved = new ArrayList<>();
        for (DutyRoster item : rosters) {
            saved.add(createShiftSchedule(item, supervisorNameHeader, supervisorBadgeHeader));
        }
        return saved;
    }

    @Transactional(readOnly = true)
    public List<DutyRoster> getAllDutyRoster() {
        return dutyRosterRepo.findAllByOrderByDutyDateDescStartTimeAsc();
    }

    @Transactional(readOnly = true)
    public List<DutyRoster> searchDutyRoster(LocalDate date, String status, String postLocation, String supervisor, String guard) {
        boolean hasFilter = (date != null) ||
                (status != null && !status.isBlank()) ||
                (postLocation != null && !postLocation.isBlank()) ||
                (supervisor != null && !supervisor.isBlank()) ||
                (guard != null && !guard.isBlank());

        if (!hasFilter) {
            return getAllDutyRoster();
        }

        String filterStatus = (status != null && !status.isBlank()) ? status.trim() : null;
        String filterPost = (postLocation != null && !postLocation.isBlank()) ? postLocation.trim() : null;
        String filterSup = (supervisor != null && !supervisor.isBlank()) ? supervisor.trim() : null;
        String filterGrd = (guard != null && !guard.isBlank()) ? guard.trim() : null;

        return dutyRosterRepo.searchRoster(date, filterStatus, filterPost, filterSup, filterGrd);
    }

    @Transactional(readOnly = true)
    public Optional<DutyRoster> getDutyRosterById(Long id) {
        return dutyRosterRepo.findById(id);
    }

    public DutyRoster updateShiftSchedule(Long id, DutyRoster updatedData) {
        return dutyRosterRepo.findById(id).map(existing -> {
            if (updatedData.getSupervisorName() != null && !updatedData.getSupervisorName().isBlank()) {
                existing.setSupervisorName(updatedData.getSupervisorName());
            }
            if (updatedData.getSupervisorBadgeNumber() != null) {
                existing.setSupervisorBadgeNumber(updatedData.getSupervisorBadgeNumber());
            }
            if (updatedData.getGuardName() != null && !updatedData.getGuardName().isBlank()) {
                existing.setGuardName(updatedData.getGuardName());
            }
            if (updatedData.getGuardBadgeNumber() != null && !updatedData.getGuardBadgeNumber().isBlank()) {
                existing.setGuardBadgeNumber(updatedData.getGuardBadgeNumber());
            }
            if (updatedData.getPostLocation() != null && !updatedData.getPostLocation().isBlank()) {
                existing.setPostLocation(updatedData.getPostLocation());
            }
            if (updatedData.getDutyDate() != null) {
                existing.setDutyDate(updatedData.getDutyDate());
            }
            if (updatedData.getShiftType() != null && !updatedData.getShiftType().isBlank()) {
                existing.setShiftType(updatedData.getShiftType());
            }
            if (updatedData.getStartTime() != null) {
                existing.setStartTime(updatedData.getStartTime());
            }
            if (updatedData.getEndTime() != null) {
                existing.setEndTime(updatedData.getEndTime());
            }
            if (updatedData.getRelieverName() != null) {
                existing.setRelieverName(updatedData.getRelieverName());
            }
            if (updatedData.getRelieverBadgeNumber() != null) {
                existing.setRelieverBadgeNumber(updatedData.getRelieverBadgeNumber());
            }
            if (updatedData.getRelieverStatus() != null) {
                existing.setRelieverStatus(updatedData.getRelieverStatus());
            }
            if (updatedData.getRelieverTimeSlot() != null) {
                existing.setRelieverTimeSlot(updatedData.getRelieverTimeSlot());
            }
            if (updatedData.getStatus() != null && !updatedData.getStatus().isBlank()) {
                existing.setStatus(updatedData.getStatus());
            }
            if (updatedData.getPriority() != null) {
                existing.setPriority(updatedData.getPriority());
            }
            if (updatedData.getNotes() != null) {
                existing.setNotes(updatedData.getNotes());
            }
            existing.setUpdatedAt(LocalDateTime.now());
            return dutyRosterRepo.save(existing);
        }).orElseThrow(() -> new NoSuchElementException("Duty roster shift schedule not found with id: " + id));
    }

    public DutyRoster updateRelieverAssignment(Long id, String relieverName, String relieverBadgeNumber, String relieverStatus, String relieverTimeSlot) {
        return dutyRosterRepo.findById(id).map(existing -> {
            existing.setRelieverName(relieverName);
            existing.setRelieverBadgeNumber(relieverBadgeNumber);
            if (relieverStatus != null && !relieverStatus.isBlank()) {
                existing.setRelieverStatus(relieverStatus);
            } else {
                existing.setRelieverStatus((relieverName != null && !relieverName.isBlank()) ? "ASSIGNED" : "NOT_ASSIGNED");
            }
            if (relieverTimeSlot != null) {
                existing.setRelieverTimeSlot(relieverTimeSlot);
            }
            existing.setUpdatedAt(LocalDateTime.now());
            return dutyRosterRepo.save(existing);
        }).orElseThrow(() -> new NoSuchElementException("Duty roster shift schedule not found with id: " + id));
    }

    public DutyRoster updateStatus(Long id, String status) {
        return dutyRosterRepo.findById(id).map(existing -> {
            existing.setStatus(status);
            existing.setUpdatedAt(LocalDateTime.now());
            return dutyRosterRepo.save(existing);
        }).orElseThrow(() -> new NoSuchElementException("Duty roster shift schedule not found with id: " + id));
    }

    public boolean deleteShiftSchedule(Long id) {
        if (dutyRosterRepo.existsById(id)) {
            dutyRosterRepo.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getRosterSummary(LocalDate date) {
        List<DutyRoster> rosterList = (date != null) 
                ? dutyRosterRepo.findByDutyDateOrderByStartTimeAsc(date) 
                : dutyRosterRepo.findAll();

        long totalShifts = rosterList.size();
        long scheduledCount = rosterList.stream().filter(r -> "SCHEDULED".equalsIgnoreCase(r.getStatus())).count();
        long activeCount = rosterList.stream().filter(r -> "ACTIVE".equalsIgnoreCase(r.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(r.getStatus())).count();
        long completedCount = rosterList.stream().filter(r -> "COMPLETED".equalsIgnoreCase(r.getStatus())).count();
        long relieversAssigned = rosterList.stream().filter(r -> r.getRelieverName() != null && !r.getRelieverName().isBlank()).count();
        long relieversPending = totalShifts - relieversAssigned;

        Set<String> uniquePosts = new HashSet<>();
        for (DutyRoster r : rosterList) {
            if (r.getPostLocation() != null) {
                uniquePosts.add(r.getPostLocation());
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("date", date != null ? date.toString() : "ALL");
        summary.put("totalShifts", totalShifts);
        summary.put("scheduledShifts", scheduledCount);
        summary.put("activeShifts", activeCount);
        summary.put("completedShifts", completedCount);
        summary.put("relieversAssignedCount", relieversAssigned);
        summary.put("relieversPendingCount", Math.max(0, relieversPending));
        summary.put("uniquePostsCovered", uniquePosts.size());
        summary.put("rosterTitle", "Guard Duty Schedule & Reliever Assignment Roster");

        return summary;
    }

    private void applyDefaultTimingForShiftType(DutyRoster roster) {
        String shiftType = roster.getShiftType() != null ? roster.getShiftType().toUpperCase() : "MORNING";
        switch (shiftType) {
            case "EVENING":
            case "AFTERNOON":
                roster.setStartTime("14:00");
                roster.setEndTime("22:00");
                break;
            case "NIGHT":
                roster.setStartTime("22:00");
                roster.setEndTime("06:00");
                break;
            case "SWING":
                roster.setStartTime("16:00");
                roster.setEndTime("00:00");
                break;
            case "MORNING":
            default:
                roster.setStartTime("06:00");
                roster.setEndTime("14:00");
                break;
        }
    }
}
