package com.pedregal.backend.repository;

import com.pedregal.backend.entity.EquipoMaquinaria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EquipoMaquinariaRepository extends JpaRepository<EquipoMaquinaria, Long> {
    Optional<EquipoMaquinaria> findBySyncId(String syncId);
    boolean existsBySyncId(String syncId);
}
