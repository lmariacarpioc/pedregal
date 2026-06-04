package com.pedregal.backend.repository;

import com.pedregal.backend.entity.RegistroCosecha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RegistroCosechaRepository extends JpaRepository<RegistroCosecha, String> {

    /**
     * Busca todos los registros subidos desde un dispositivo específico.
     */
    List<RegistroCosecha> findByDeviceId(String deviceId);

    /**
     * Busca registros por la fecha de jornada laboral.
     */
    List<RegistroCosecha> findByFechaJornada(LocalDate fechaJornada);

    /**
     * Busca registros de un trabajador específico por su DNI.
     */
    List<RegistroCosecha> findByTrabajadorDni(String trabajadorDni);

    /**
     * Busca registros por DNI del trabajador y fecha de jornada.
     */
    List<RegistroCosecha> findByTrabajadorDniAndFechaJornada(String trabajadorDni, LocalDate fechaJornada);

    /**
     * Busca registros por lote.
     */
    List<RegistroCosecha> findByLote(String lote);
}
