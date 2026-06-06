package com.pedregal.backend.repository;

import com.pedregal.backend.entity.ParteDiarioDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParteDiarioDetalleRepository extends JpaRepository<ParteDiarioDetalle, Long> {
    Optional<ParteDiarioDetalle> findBySyncId(String syncId);
    boolean existsBySyncId(String syncId);
    java.util.List<ParteDiarioDetalle> findByParteDiarioId(Long parteDiarioId);
}