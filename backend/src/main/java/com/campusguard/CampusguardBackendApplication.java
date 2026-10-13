package com.campusguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CampusguardBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CampusguardBackendApplication.class, args);
	}

}
