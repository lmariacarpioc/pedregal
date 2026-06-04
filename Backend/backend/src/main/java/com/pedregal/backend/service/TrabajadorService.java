package com.pedregal.backend.service;

import com.pedregal.backend.entity.Trabajador;
import com.pedregal.backend.repository.TrabajadorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrabajadorService {

    private final TrabajadorRepository trabajadorRepository;

    @Transactional(readOnly = true)
    public List<Trabajador> listarTodos() {
        return trabajadorRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Trabajador> listarActivos() {
        return trabajadorRepository.findByActivoTrue();
    }

    @Transactional(readOnly = true)
    public Optional<Trabajador> buscarPorId(String id) {
        return trabajadorRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Trabajador> buscarPorDni(String dni) {
        return trabajadorRepository.findByDni(dni);
    }

    @Transactional
    public Trabajador guardar(Trabajador trabajador) {
        log.info("Guardando trabajador: {} (DNI: {})", trabajador.getNombreCompleto(), trabajador.getDni());
        return trabajadorRepository.save(trabajador);
    }

    @Transactional
    public Trabajador actualizar(String id, Trabajador datosActualizados) {
        Trabajador existente = trabajadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado con ID: " + id));

        existente.setNombreCompleto(datosActualizados.getNombreCompleto());
        existente.setDni(datosActualizados.getDni());
        existente.setLaborAsignada(datosActualizados.getLaborAsignada());
        existente.setCuadrilla(datosActualizados.getCuadrilla());
        existente.setActivo(datosActualizados.getActivo());

        log.info("Trabajador actualizado: {} (ID: {})", existente.getNombreCompleto(), id);
        return trabajadorRepository.save(existente);
    }

    @Transactional
    public void eliminar(String id) {
        if (!trabajadorRepository.existsById(id)) {
            throw new RuntimeException("Trabajador no encontrado con ID: " + id);
        }
        trabajadorRepository.deleteById(id);
        log.info("Trabajador eliminado con ID: {}", id);
    }
}
