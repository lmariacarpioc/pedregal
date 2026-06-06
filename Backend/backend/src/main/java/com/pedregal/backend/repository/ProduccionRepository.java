package com.pedregal.backend.repository;

import com.pedregal.backend.entity.Produccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProduccionRepository extends JpaRepository<Produccion, Long> {
    Optional<Produccion> findBySyncId(String syncId);
    boolean existsBySyncId(String syncId);
}