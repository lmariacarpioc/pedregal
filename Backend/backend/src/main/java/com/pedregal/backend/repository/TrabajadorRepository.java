package com.pedregal.backend.repository;

import com.pedregal.backend.entity.Trabajador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrabajadorRepository extends JpaRepository<Trabajador, Long> {
    Optional<Trabajador> findByDni(String dni);
    Optional<Trabajador> findBySyncId(String syncId);
    boolean existsByDni(String dni);
    boolean existsBySyncId(String syncId);
    List<Trabajador> findByActivoTrue();
    List<Trabajador> findByAreaTrabajo(String areaTrabajo);
}