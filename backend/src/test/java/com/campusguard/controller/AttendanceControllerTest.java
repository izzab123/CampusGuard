package com.campusguard.controller;

import com.campusguard.model.AttendanceConfig;
import com.campusguard.model.DutyRoster;
import com.campusguard.repository.AttendanceConfigRepository;
import com.campusguard.repository.DutyRosterRepository;
import com.campusguard.repository.NotificationRepository;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class AttendanceControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private DutyRosterRepository dutyRosterRepository;

    @Autowired
    private AttendanceConfigRepository attendanceConfigRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
        dutyRosterRepository.deleteAll();
        attendanceConfigRepository.deleteAll();
        if (notificationRepository != null) {
            notificationRepository.deleteAll();
        }
    }

    @Test
    void adminCanConfigureGracePeriodXInMinutes() throws Exception {
        // 1. Initial config retrieval returns default (15 minutes)
        mockMvc.perform(get("/api/attendance/config"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gracePeriodMinutes").value(15));

        // 2. Admin configures grace period to 20 minutes
        Map<String, Object> update = Map.of("gracePeriodMinutes", 20);
        mockMvc.perform(put("/api/attendance/config")
                        .header("X-User-Role", "Security Admin")
                        .header("X-User-Name", "Root Admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gracePeriodMinutes").value(20))
                .andExpect(jsonPath("$.updatedBy").value("Root Admin"));

        // 3. Verify security restriction: Security Guard is forbidden (403)
        mockMvc.perform(put("/api/attendance/config")
                        .header("X-User-Role", "Security Guard")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("gracePeriodMinutes", 30))))
                .andExpect(status().isForbidden());
    }

    @Test
    void automaticallyMarksGuardAsNoShowIfNoCheckInExistsAfterGracePeriod() throws Exception {
        // Set grace period to 15 minutes
        attendanceConfigRepository.save(new AttendanceConfig(1L, 15, true, "Admin"));

        // Create shift scheduled to start 30 minutes ago with NO check-in
        LocalDateTime shiftStartPast = LocalDateTime.now().minusMinutes(30);
        DutyRoster unstaffedShift = new DutyRoster();
        unstaffedShift.setGuardName("Officer Donald Draper");
        unstaffedShift.setGuardBadgeNumber("SEC-901");
        unstaffedShift.setSupervisorName("Supervisor Sarah Connor");
        unstaffedShift.setPostLocation("North Perimeter Gate 02");
        unstaffedShift.setDutyDate(LocalDate.now());
        unstaffedShift.setShiftStart(shiftStartPast);
        unstaffedShift.setStatus("SCHEDULED");
        unstaffedShift.setCheckedIn(false);
        DutyRoster saved = dutyRosterRepository.save(unstaffedShift);

        // Trigger evaluation
        mockMvc.perform(post("/api/attendance/evaluate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].guardName").value("Officer Donald Draper"))
                .andExpect(jsonPath("$[0].status").value("NO_SHOW"))
                .andExpect(jsonPath("$[0].countsAsNoShow").value(true));

        // Verify updated entity in repository
        DutyRoster updated = dutyRosterRepository.findById(saved.getId()).orElseThrow();
        assertEquals("NO_SHOW", updated.getStatus());
        assertEquals("NO_SHOW", updated.getAttendanceStatus());
        assertTrue(updated.isCountsAsNoShow());
        assertNotNull(updated.getNoShowFlaggedAt());
        assertTrue(updated.getNoShowReason().contains("15 minutes"));

        // Supervisor can view in no-show records
        mockMvc.perform(get("/api/attendance/no-shows"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].guardName").value("Officer Donald Draper"));
    }

    @Test
    void neverFlagsGuardWhoHasCheckedIn() throws Exception {
        attendanceConfigRepository.save(new AttendanceConfig(1L, 15, true, "Admin"));

        // Guard whose shift started 45 minutes ago BUT already checked in
        LocalDateTime shiftStartPast = LocalDateTime.now().minusMinutes(45);
        DutyRoster checkedInShift = new DutyRoster();
        checkedInShift.setGuardName("Officer Marcus Vance");
        checkedInShift.setGuardBadgeNumber("Shield #4082");
        checkedInShift.setSupervisorName("Supervisor Sarah Connor");
        checkedInShift.setPostLocation("Main Gate Barrier");
        checkedInShift.setDutyDate(LocalDate.now());
        checkedInShift.setShiftStart(shiftStartPast);
        checkedInShift.setCheckedIn(true);
        checkedInShift.setCheckInTime(shiftStartPast.plusMinutes(5));
        checkedInShift.setStatus("CHECKED_IN");
        checkedInShift.setAttendanceStatus("PRESENT");
        DutyRoster saved = dutyRosterRepository.save(checkedInShift);

        // Evaluate
        mockMvc.perform(post("/api/attendance/evaluate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        DutyRoster refreshed = dutyRosterRepository.findById(saved.getId()).orElseThrow();
        assertEquals("CHECKED_IN", refreshed.getStatus());
        assertEquals("PRESENT", refreshed.getAttendanceStatus());
        assertFalse(refreshed.isCountsAsNoShow());
        assertNull(refreshed.getNoShowFlaggedAt());
    }

    @Test
    void neverFlagsGuardWhoseDutyHasBeenReassigned() throws Exception {
        attendanceConfigRepository.save(new AttendanceConfig(1L, 15, true, "Admin"));

        // Absent guard whose shift was reassigned (excused absence)
        LocalDateTime shiftStartPast = LocalDateTime.now().minusMinutes(50);
        DutyRoster reassignedShift = new DutyRoster();
        reassignedShift.setGuardName("Officer Marcus Vance"); // Replacement guard
        reassignedShift.setGuardBadgeNumber("Shield #4082");
        reassignedShift.setSupervisorName("Supervisor Sarah Connor");
        reassignedShift.setPostLocation("South Pedestrian Hub");
        reassignedShift.setDutyDate(LocalDate.now());
        reassignedShift.setShiftStart(shiftStartPast);
        reassignedShift.setStatus("SCHEDULED");
        // Reassignment & Excused Absence fields
        reassignedShift.setReassigned(true);
        reassignedShift.setReassignedAt(LocalDateTime.now().minusMinutes(60));
        reassignedShift.setOriginalGuardName("Officer Tariq Mansoor");
        reassignedShift.setOriginalGuardBadgeNumber("GD-201");
        reassignedShift.setAbsentGuardAttendanceStatus("EXCUSED_ABSENCE");
        reassignedShift.setReassignmentReason("Sudden Medical Illness / Emergency Leave");
        reassignedShift.setCountsAsNoShow(false);
        DutyRoster saved = dutyRosterRepository.save(reassignedShift);

        // Evaluate
        mockMvc.perform(post("/api/attendance/evaluate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        DutyRoster refreshed = dutyRosterRepository.findById(saved.getId()).orElseThrow();
        assertNotEquals("NO_SHOW", refreshed.getStatus());
        assertFalse(refreshed.isCountsAsNoShow());
        assertEquals("EXCUSED_ABSENCE", refreshed.getAbsentGuardAttendanceStatus());
    }

    @Test
    void neverFlagsGuardWhoseLeaveHasBeenApproved() throws Exception {
        attendanceConfigRepository.save(new AttendanceConfig(1L, 15, true, "Admin"));

        // Guard whose leave was approved
        LocalDateTime shiftStartPast = LocalDateTime.now().minusMinutes(40);
        DutyRoster leaveShift = new DutyRoster();
        leaveShift.setGuardName("Officer Maya Lin");
        leaveShift.setGuardBadgeNumber("GD-204");
        leaveShift.setSupervisorName("Supervisor David Clark");
        leaveShift.setPostLocation("Science Complex Gate");
        leaveShift.setDutyDate(LocalDate.now());
        leaveShift.setShiftStart(shiftStartPast);
        leaveShift.setStatus("APPROVED_LEAVE");
        leaveShift.setAttendanceStatus("ON_LEAVE");
        leaveShift.setLeaveApproved(true);
        leaveShift.setLeaveReason("Approved Bereavement Leave");
        leaveShift.setCountsAsNoShow(false);
        DutyRoster saved = dutyRosterRepository.save(leaveShift);

        // Evaluate
        mockMvc.perform(post("/api/attendance/evaluate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        DutyRoster refreshed = dutyRosterRepository.findById(saved.getId()).orElseThrow();
        assertEquals("APPROVED_LEAVE", refreshed.getStatus());
        assertEquals("ON_LEAVE", refreshed.getAttendanceStatus());
        assertFalse(refreshed.isCountsAsNoShow());
        assertNull(refreshed.getNoShowFlaggedAt());
    }
}
