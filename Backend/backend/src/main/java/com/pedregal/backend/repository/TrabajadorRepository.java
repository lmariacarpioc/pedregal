package com.pedregal.backend.repository;

import com.pedregal.backend.entity.Trabajador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrabajadorRepository extends JpaRepository<Trabajador, String> {

    Optional<Trabajador> findByDni(String dni);

    List<Trabajador> findByActivoTrue();

    List<Trabajador> findByCuadrilla(String cuadrilla);

    boolean existsByDni(String dni);
}
