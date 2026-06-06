package com.pedregal.backend.repository;

import com.pedregal.backend.entity.StaffAsignacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffAsignacionRepository extends JpaRepository<StaffAsignacion, Long> {
    Optional<StaffAsignacion> findBySyncId(String syncId);
    boolean existsBySyncId(String syncId);
}