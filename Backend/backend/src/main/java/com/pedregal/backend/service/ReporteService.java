package com.pedregal.backend.service;

import com.pedregal.backend.entity.Reporte;
import com.pedregal.backend.repository.ReporteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final ReporteRepository repository;

    public List<Reporte> findAll() {
        return repository.findAll();
    }

    public Reporte findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado con id: " + id));
    }

    public Reporte save(Reporte entity) {
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Reporte no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }
}