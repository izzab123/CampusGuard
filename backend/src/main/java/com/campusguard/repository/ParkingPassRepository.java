package com.campusguard.repository;

import com.campusguard.model.ParkingPass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParkingPassRepository extends JpaRepository<ParkingPass, Long> {
    Optional<ParkingPass> findByPassToken(String passToken);
    Optional<ParkingPass> findByPlateNumber(String plateNumber);
}
