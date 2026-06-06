package com.pedregal.backend.repository;

import com.pedregal.backend.entity.ParteDiario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParteDiarioRepository extends JpaRepository<ParteDiario, Long> {
    Optional<ParteDiario> findBySyncId(String syncId);
    boolean existsBySyncId(String syncId);
    List<ParteDiario> findByFecha(LocalDate fecha);
    List<ParteDiario> findByEstado(String estado);
    List<ParteDiario> findByUsuarioId(Long usuarioId);
    List<ParteDiario> findByFechaBetween(LocalDate desde, LocalDate hasta);
    long countByFecha(LocalDate fecha);
}