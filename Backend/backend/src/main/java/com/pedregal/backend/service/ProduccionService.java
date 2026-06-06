package com.pedregal.backend.service;

import com.pedregal.backend.entity.Produccion;
import com.pedregal.backend.repository.ProduccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProduccionService {

    private final ProduccionRepository repository;

    public List<Produccion> findAll() {
        return repository.findAll();
    }

    public Produccion findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produccion no encontrado con id: " + id));
    }

    public Produccion save(Produccion entity) {
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Produccion no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }
}