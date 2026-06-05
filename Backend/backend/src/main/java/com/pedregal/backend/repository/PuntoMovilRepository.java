package com.pedregal.backend.repository;

import com.pedregal.backend.entity.PuntoMovil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PuntoMovilRepository extends JpaRepository<PuntoMovil, Long> {
    Optional<PuntoMovil> findBySyncId(String syncId);
    boolean existsBySyncId(String syncId);
}
