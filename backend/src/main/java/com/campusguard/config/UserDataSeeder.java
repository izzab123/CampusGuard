package com.campusguard.config;

import com.campusguard.model.User;
import com.campusguard.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class UserDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(UserDataSeeder.class);

    @Bean
    public CommandLineRunner seedUsers(UserRepository userRepository) {
        return args -> {
            logger.info("Initializing CampusGuard Seed Accounts...");

            List<User> seedUsers = List.of(
                new User("student@campusguard.edu", "12345678", "Student", "Alex Morgan", "#STU-88201", "Dept. of Computer Science & Eng."),
                new User("proctor@campusguard.edu", "12345678", "Proctor and DSW", "Dr. Arthur Vance", "DSW Executive Dean #PR-109", "Dean of Student Welfare"),
                new User("guard@campusguard.edu", "12345678", "Security Guard", "Officer Marcus Vance", "Shield #4082", "Campus Security Division"),
                new User("supervisor@campusguard.edu", "12345678", "Shift Supervisor", "Supervisor Elena Rostova", "Badge #SS-104", "Operations Dispatch Control"),
                new User("admin@campusguard.edu", "12345678", "Admin", "System Administrator", "Root Admin #ADM-001", "Institutional Security IT")
            );

            for (User user : seedUsers) {
                userRepository.findByEmailIgnoreCase(user.getEmail()).ifPresentOrElse(
                    existing -> {
                        existing.setPassword(user.getPassword());
                        existing.setRole(user.getRole());
                        existing.setFullName(user.getFullName());
                        existing.setBadgeNumber(user.getBadgeNumber());
                        existing.setDepartment(user.getDepartment());
                        userRepository.save(existing);
                        logger.info("Updated seed user: {} with role: {}", existing.getEmail(), existing.getRole());
                    },
                    () -> {
                        userRepository.save(user);
                        logger.info("Created seed user: {} with role: {}", user.getEmail(), user.getRole());
                    }
                );
            }

            logger.info("CampusGuard Seed Accounts initialization complete. Total accounts: {}", userRepository.count());
        };
    }
}
