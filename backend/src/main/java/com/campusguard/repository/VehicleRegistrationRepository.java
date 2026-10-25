package com.campusguard.repository;

import com.campusguard.model.VehicleRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRegistrationRepository extends JpaRepository<VehicleRegistration, Long> {
    boolean existsByVehicleNumberIgnoreCase(String vehicleNumber);
    Optional<VehicleRegistration> findByVehicleNumberIgnoreCase(String vehicleNumber);
    List<VehicleRegistration> findAllByOrderByCreatedAtDesc();
    List<VehicleRegistration> findBySubmittedByEmailIgnoreCaseOrderByCreatedAtDesc(String email);
    List<VehicleRegistration> findByStudentIdIgnoreCaseOrderByCreatedAtDesc(String studentId);
    List<VehicleRegistration> findByStatusIgnoreCaseOrderByCreatedAtDesc(String status);
}
