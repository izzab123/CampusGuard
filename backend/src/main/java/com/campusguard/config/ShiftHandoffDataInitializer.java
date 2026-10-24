package com.campusguard.config;

import com.campusguard.model.ShiftHandoff;
import com.campusguard.model.ShiftHandoffAcknowledgement;
import com.campusguard.repository.ShiftHandoffAcknowledgementRepository;
import com.campusguard.repository.ShiftHandoffRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class ShiftHandoffDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(ShiftHandoffDataInitializer.class);

    private final ShiftHandoffRepository handoffRepo;
    private final ShiftHandoffAcknowledgementRepository ackRepo;

    public ShiftHandoffDataInitializer(
            ShiftHandoffRepository handoffRepo,
            ShiftHandoffAcknowledgementRepository ackRepo
    ) {
        this.handoffRepo = handoffRepo;
        this.ackRepo = ackRepo;
    }

    @Override
    public void run(String... args) {
        if (handoffRepo.count() == 0) {
            LocalDate today = LocalDate.now();

            // 1. Pending handoff at North Gate Checkpoint (for incoming guard Officer Marcus Vance to view and acknowledge)
            ShiftHandoff pendingHandoff = new ShiftHandoff(
                    "North Gate Checkpoint",
                    7L,
                    "Officer Sarah Jenkins",
                    "Shield #4120",
                    "s.jenkins@campusguard.edu",
                    "MORNING",
                    today,
                    "06:00",
                    "14:00",
                    "Vehicle gate barrier sensor recalibrated. High commercial deliveries scheduled between 14:00 and 16:00. Visitor logs up to date on desk.",
                    "Radios (2/2) OK, Barrier Keyring #04, RFID Handheld Reader Operational",
                    "North Gate Master Key, Emergency Manual Override Crank"
            );
            pendingHandoff.setStatus("PENDING_ACKNOWLEDGEMENT");
            pendingHandoff.setAcknowledged(false);
            pendingHandoff.setResponsibilityTransferred(false);
            handoffRepo.save(pendingHandoff);

            // 2. Previously acknowledged handoff at Science & Engineering Quad
            ShiftHandoff acknowledgedHandoff = new ShiftHandoff(
                    "Science & Engineering Quad",
                    6L,
                    "Officer David Chen",
                    "Shield #3910",
                    "d.chen@campusguard.edu",
                    "MORNING",
                    today,
                    "08:00",
                    "16:00",
                    "Research lab exterior perimeter secured. Hazardous chemical staging dock cleared.",
                    "Patrol Radio Unit #12, Lab Access Fob",
                    "Science Quad Master Fob #2"
            );
            acknowledgedHandoff.setStatus("ACKNOWLEDGED");
            acknowledgedHandoff.setAcknowledged(true);
            LocalDateTime ackTime = LocalDateTime.now().minusHours(1);
            acknowledgedHandoff.setAcknowledgedAt(ackTime);
            acknowledgedHandoff.setAcknowledgedByGuardId(3L);
            acknowledgedHandoff.setAcknowledgedByGuardName("Officer Marcus Vance");
            acknowledgedHandoff.setAcknowledgedByGuardBadge("Shield #4082");
            acknowledgedHandoff.setResponsibilityTransferred(true);
            acknowledgedHandoff.setAcknowledgementNotes("Physical asset inventory verified. Relieved Officer Chen on post.");

            ShiftHandoff savedAckHandoff = handoffRepo.save(acknowledgedHandoff);

            ShiftHandoffAcknowledgement ack = new ShiftHandoffAcknowledgement(
                    savedAckHandoff.getId(),
                    savedAckHandoff.getGatePost(),
                    3L,
                    "Officer Marcus Vance",
                    "Shield #4082",
                    "guard@campusguard.edu",
                    ackTime,
                    "Physical asset inventory verified. Relieved Officer Chen on post.",
                    6L,
                    "Officer David Chen",
                    "Shield #3910"
            );
            ack.setResponsibilityTransferred(true);
            ShiftHandoffAcknowledgement savedAck = ackRepo.save(ack);

            savedAckHandoff.setAcknowledgement(savedAck);
            handoffRepo.save(savedAckHandoff);

            // 3. Yesterday's Evening shift at South Gate Checkpoint
            ShiftHandoff yesterdayHandoff = new ShiftHandoff(
                    "South Gate Checkpoint",
                    3L,
                    "Officer Marcus Vance",
                    "Shield #4082",
                    "guard@campusguard.edu",
                    "EVENING",
                    today.minusDays(1),
                    "14:00",
                    "22:00",
                    "Evening visitor influx cleared. Commercial gate locked down per 21:00 protocol.",
                    "Radios (2/2) OK, Gate Key 02, Night Patrol Torch",
                    "South Gate Master Keyring"
            );
            yesterdayHandoff.setStatus("ACKNOWLEDGED");
            yesterdayHandoff.setAcknowledged(true);
            LocalDateTime yAckTime = LocalDateTime.now().minusDays(1).withHour(22).withMinute(5);
            yesterdayHandoff.setAcknowledgedAt(yAckTime);
            yesterdayHandoff.setAcknowledgedByGuardId(6L);
            yesterdayHandoff.setAcknowledgedByGuardName("Officer David Chen");
            yesterdayHandoff.setAcknowledgedByGuardBadge("Shield #3910");
            yesterdayHandoff.setResponsibilityTransferred(true);
            yesterdayHandoff.setAcknowledgementNotes("Post physically inspected. Night lockdown verified.");
            ShiftHandoff savedY = handoffRepo.save(yesterdayHandoff);

            ShiftHandoffAcknowledgement yAck = new ShiftHandoffAcknowledgement(
                    savedY.getId(),
                    savedY.getGatePost(),
                    6L,
                    "Officer David Chen",
                    "Shield #3910",
                    "d.chen@campusguard.edu",
                    yAckTime,
                    "Post physically inspected. Night lockdown verified.",
                    3L,
                    "Officer Marcus Vance",
                    "Shield #4082"
            );
            savedY.setAcknowledgement(ackRepo.save(yAck));
            handoffRepo.save(savedY);

            // 4. Past Morning shift at Central Library Gate (3 days ago)
            ShiftHandoff pastHandoff = new ShiftHandoff(
                    "Central Library & Student Plaza",
                    7L,
                    "Officer Sarah Jenkins",
                    "Shield #4120",
                    "s.jenkins@campusguard.edu",
                    "MORNING",
                    today.minusDays(3),
                    "08:00",
                    "16:00",
                    "Library exam study week flow. Emergency exit push-bars inspected and clear.",
                    "Radios (1/1) OK, Plaza Patrol Tablet",
                    "Library Emergency Key Box Key"
            );
            pastHandoff.setStatus("ACKNOWLEDGED");
            pastHandoff.setAcknowledged(true);
            LocalDateTime pAckTime = LocalDateTime.now().minusDays(3).withHour(16).withMinute(2);
            pastHandoff.setAcknowledgedAt(pAckTime);
            pastHandoff.setAcknowledgedByGuardId(3L);
            pastHandoff.setAcknowledgedByGuardName("Officer Marcus Vance");
            pastHandoff.setAcknowledgedByGuardBadge("Shield #4082");
            pastHandoff.setResponsibilityTransferred(true);
            pastHandoff.setAcknowledgementNotes("Took over evening student plaza watch.");
            ShiftHandoff savedP = handoffRepo.save(pastHandoff);

            ShiftHandoffAcknowledgement pAck = new ShiftHandoffAcknowledgement(
                    savedP.getId(),
                    savedP.getGatePost(),
                    3L,
                    "Officer Marcus Vance",
                    "Shield #4082",
                    "guard@campusguard.edu",
                    pAckTime,
                    "Took over evening student plaza watch.",
                    7L,
                    "Officer Sarah Jenkins",
                    "Shield #4120"
            );
            savedP.setAcknowledgement(ackRepo.save(pAck));
            handoffRepo.save(savedP);

            logger.info("Initialized Shift Handoff test seed records (4 history entries across dates/gates).");
        }
    }
}
