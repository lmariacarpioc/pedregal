package com.pedregal.backend.service;

import com.pedregal.backend.entity.Inversion;
import com.pedregal.backend.repository.InversionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InversionService {

    private final InversionRepository repository;

    public List<Inversion> findAll() {
        return repository.findAll();
    }

    public Inversion findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inversion no encontrado con id: " + id));
    }

    public Inversion save(Inversion entity) {
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Inversion no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }
}
