package com.pedregal.backend.service;

import com.pedregal.backend.entity.ControlEquipo;
import com.pedregal.backend.repository.ControlEquipoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ControlEquipoService {

    private final ControlEquipoRepository repository;

    public List<ControlEquipo> findAll() {
        return repository.findAll();
    }

    public ControlEquipo findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ControlEquipo no encontrado con id: " + id));
    }

    public ControlEquipo save(ControlEquipo entity) {
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("ControlEquipo no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }
}
