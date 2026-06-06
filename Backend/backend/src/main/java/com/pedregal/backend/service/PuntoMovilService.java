package com.pedregal.backend.service;

import com.pedregal.backend.entity.PuntoMovil;
import com.pedregal.backend.repository.PuntoMovilRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PuntoMovilService {

    private final PuntoMovilRepository repository;

    public List<PuntoMovil> findAll() {
        return repository.findAll();
    }

    public PuntoMovil findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("PuntoMovil no encontrado con id: " + id));
    }

    public PuntoMovil save(PuntoMovil entity) {
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("PuntoMovil no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }
}