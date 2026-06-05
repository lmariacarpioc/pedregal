package com.pedregal.backend.service;

import com.pedregal.backend.entity.Trabajador;
import com.pedregal.backend.exception.ResourceNotFoundException;
import com.pedregal.backend.repository.TrabajadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrabajadorService {

    private final TrabajadorRepository repository;

    public List<Trabajador> findAll() {
        return repository.findAll();
    }

    public List<Trabajador> findActivos() {
        return repository.findByActivoTrue();
    }

    public Trabajador findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trabajador", id));
    }

    public Trabajador save(Trabajador entity) {
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Trabajador", id);
        }
        repository.deleteById(id);
    }
}
