package com.pedregal.backend.repository;

import com.pedregal.backend.entity.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReporteRepository extends JpaRepository<Reporte, Long> {
    Optional<Reporte> findBySyncId(String syncId);
    boolean existsBySyncId(String syncId);
}
