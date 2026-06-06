package com.pedregal.backend.service;

import com.pedregal.backend.entity.EquipoMaquinaria;
import com.pedregal.backend.repository.EquipoMaquinariaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipoMaquinariaService {

    private final EquipoMaquinariaRepository repository;

    public List<EquipoMaquinaria> findAll() {
        return repository.findAll();
    }

    public EquipoMaquinaria findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("EquipoMaquinaria no encontrado con id: " + id));
    }

    public EquipoMaquinaria save(EquipoMaquinaria entity) {
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("EquipoMaquinaria no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }
}