package com.campusguard.controller;

import com.campusguard.model.DutyRoster;
import com.campusguard.model.IncidentReport;
import com.campusguard.model.ScanLog;
import com.campusguard.repository.DutyRosterRepository;
import com.campusguard.repository.IncidentReportRepository;
import com.campusguard.repository.ScanLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class SupervisorReportExportControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private IncidentReportRepository incidentRepo;

    @Autowired
    private DutyRosterRepository rosterRepo;

    @Autowired
    private ScanLogRepository scanLogRepo;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        LocalDate today = LocalDate.now();

        // Seed test incident if none
        if (incidentRepo.count() == 0) {
            IncidentReport inc = new IncidentReport(
                    "Suspicious Activity at Barrier 04",
                    "Unregistered vehicle loitering near secondary gate.",
                    "HIGH",
                    "North Gate Checkpoint",
                    "CENTRAL_DISPATCH",
                    "Officer Marcus Vance",
                    "GUARD"
            );
            inc.setStatus("OPEN");
            incidentRepo.save(inc);
        }

        // Seed test duty roster if none
        if (rosterRepo.count() == 0) {
            DutyRoster r = new DutyRoster(
                    "Supervisor Elena Rostova",
                    "Officer David Chen",
                    "Shield #3910",
                    "South Perimeter Station - Gate 03",
                    today,
                    "EVENING",
                    "16:00",
                    "00:00"
            );
            r.setAttendanceStatus("NO_SHOW");
            r.setCountsAsNoShow(true);
            r.setNoShowReason("Automated attendance surveillance timeout");
            rosterRepo.save(r);
        }

        // Seed test scan log if none
        if (scanLogRepo.count() == 0) {
            ScanLog scan = new ScanLog(
                    LocalDateTime.now(),
                    "RFID_GATE_BARRIER",
                    "North Gate Checkpoint - Barrier 04",
                    "Plate #7XYZ-42",
                    "Prof. Arthur Henderson",
                    "GRANTED",
                    "Automated Sentinel Radar",
                    "Faculty RFID tag auto-verified"
            );
            scanLogRepo.save(scan);
        }
    }

    @Test
    void testGetIncidentsSummaryPreview() throws Exception {
        LocalDate today = LocalDate.now();
        mockMvc.perform(get("/api/supervisor/reports/summary")
                        .param("reportType", "incidents")
                        .param("startDate", today.minusDays(7).toString())
                        .param("endDate", today.toString())
                        .header("X-User-Role", "Shift Supervisor")
                        .header("X-User-Name", "Elena Rostova")
                        .header("X-User-Badge", "SS-104"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reportType", is("incidents")))
                .andExpect(jsonPath("$.generatedBy", is("Elena Rostova")))
                .andExpect(jsonPath("$.generatedByBadge", is("SS-104")))
                .andExpect(jsonPath("$.startDate", notNullValue()))
                .andExpect(jsonPath("$.endDate", notNullValue()))
                .andExpect(jsonPath("$.metrics.totalIncidents", notNullValue()));
    }

    @Test
    void testGetAttendanceSummaryPreview() throws Exception {
        LocalDate today = LocalDate.now();
        mockMvc.perform(get("/api/supervisor/reports/summary")
                        .param("reportType", "attendance")
                        .param("startDate", today.minusDays(7).toString())
                        .param("endDate", today.toString())
                        .header("X-User-Role", "Shift Supervisor")
                        .header("X-User-Name", "Elena Rostova")
                        .header("X-User-Badge", "SS-104"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reportType", is("attendance")))
                .andExpect(jsonPath("$.generatedBy", is("Elena Rostova")))
                .andExpect(jsonPath("$.metrics.totalShifts", notNullValue()));
    }

    @Test
    void testGetScanLogsSummaryPreview() throws Exception {
        LocalDate today = LocalDate.now();
        mockMvc.perform(get("/api/supervisor/reports/summary")
                        .param("reportType", "scan-logs")
                        .param("startDate", today.minusDays(7).toString())
                        .param("endDate", today.toString())
                        .header("X-User-Role", "Shift Supervisor")
                        .header("X-User-Name", "Elena Rostova")
                        .header("X-User-Badge", "SS-104"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reportType", is("scan-logs")))
                .andExpect(jsonPath("$.generatedBy", is("Elena Rostova")))
                .andExpect(jsonPath("$.metrics.totalScans", notNullValue()));
    }

    @Test
    void testExportCsvContainsRequiredMetadataHeader() throws Exception {
        LocalDate today = LocalDate.now();
        MvcResult result = mockMvc.perform(get("/api/supervisor/reports/export/csv")
                        .param("reportType", "incidents")
                        .param("startDate", today.minusDays(7).toString())
                        .param("endDate", today.toString())
                        .header("X-User-Role", "Shift Supervisor")
                        .header("X-User-Name", "Elena Rostova")
                        .header("X-User-Badge", "SS-104"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", containsString(".csv")))
                .andReturn();

        byte[] bytes = result.getResponse().getContentAsByteArray();
        String csvContent = new String(bytes, StandardCharsets.UTF_8);

        // Verify required metadata in header
        assertTrue(csvContent.contains("Selected Date Range:"), "CSV should contain Selected Date Range in metadata");
        assertTrue(csvContent.contains("Timestamp of Generation:"), "CSV should contain Timestamp of Generation");
        assertTrue(csvContent.contains("Generated By: Elena Rostova"), "CSV should contain Generated By name");
        assertTrue(csvContent.contains("Staff ID / Badge: SS-104"), "CSV should contain Staff ID / Badge");
        assertTrue(csvContent.contains("Incident ID,Reported Timestamp,Title"), "CSV should contain tabular columns");
    }

    @Test
    void testExportPdfValidFormatAndMetadata() throws Exception {
        LocalDate today = LocalDate.now();
        MvcResult result = mockMvc.perform(get("/api/supervisor/reports/export/pdf")
                        .param("reportType", "attendance")
                        .param("startDate", today.minusDays(7).toString())
                        .param("endDate", today.toString())
                        .header("X-User-Role", "Shift Supervisor")
                        .header("X-User-Name", "Elena Rostova")
                        .header("X-User-Badge", "SS-104"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().string("Content-Disposition", containsString(".pdf")))
                .andReturn();

        byte[] pdfBytes = result.getResponse().getContentAsByteArray();
        assertTrue(pdfBytes.length > 200, "PDF should have substantial length");

        String pdfStr = new String(pdfBytes, StandardCharsets.ISO_8859_1);
        assertTrue(pdfStr.startsWith("%PDF-1.4"), "PDF must begin with %PDF-1.4 header");
        assertTrue(pdfStr.contains("%%EOF"), "PDF must end with %%EOF marker");
        assertTrue(pdfStr.contains("CAMPUSGUARD"), "PDF must contain organization branding");
        assertTrue(pdfStr.contains("Elena Rostova"), "PDF must contain generator name in metadata");
    }

    @Test
    void testExportPdfForScanLogs() throws Exception {
        LocalDate today = LocalDate.now();
        MvcResult result = mockMvc.perform(get("/api/supervisor/reports/export/pdf")
                        .param("reportType", "scan-logs")
                        .param("startDate", today.minusDays(7).toString())
                        .param("endDate", today.toString())
                        .header("X-User-Role", "Shift Supervisor")
                        .header("X-User-Name", "Elena Rostova")
                        .header("X-User-Badge", "SS-104"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().string("Content-Disposition", containsString(".pdf")))
                .andReturn();

        byte[] pdfBytes = result.getResponse().getContentAsByteArray();
        assertTrue(pdfBytes.length > 200);
        String pdfStr = new String(pdfBytes, StandardCharsets.ISO_8859_1);
        assertTrue(pdfStr.startsWith("%PDF-1.4"));
        assertTrue(pdfStr.contains("%%EOF"));
    }

    @Test
    void testRoleBasedSecurityForbiddenForUnauthorizedRole() throws Exception {
        LocalDate today = LocalDate.now();
        mockMvc.perform(get("/api/supervisor/reports/summary")
                        .param("reportType", "incidents")
                        .param("startDate", today.minusDays(7).toString())
                        .param("endDate", today.toString())
                        .header("X-User-Role", "Security Guard")
                        .header("X-User-Name", "Guard Officer"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", containsString("Access denied")));

        mockMvc.perform(get("/api/supervisor/reports/export/csv")
                        .param("reportType", "incidents")
                        .header("X-User-Role", "Student")
                        .header("X-User-Name", "Student User"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/supervisor/reports/export/pdf")
                        .param("reportType", "incidents")
                        .header("X-User-Role", "Student")
                        .header("X-User-Name", "Student User"))
                .andExpect(status().isForbidden());
    }
}
