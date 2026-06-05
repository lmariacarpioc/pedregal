package com.pedregal.backend.repository;

import com.pedregal.backend.entity.ControlEquipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ControlEquipoRepository extends JpaRepository<ControlEquipo, Long> {
    Optional<ControlEquipo> findBySyncId(String syncId);
    boolean existsBySyncId(String syncId);
}
