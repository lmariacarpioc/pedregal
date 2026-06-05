package com.pedregal.backend.service;

import com.pedregal.backend.entity.ParteDiarioDetalle;
import com.pedregal.backend.repository.ParteDiarioDetalleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParteDiarioDetalleService {

    private final ParteDiarioDetalleRepository repository;

    public List<ParteDiarioDetalle> findAll() {
        return repository.findAll();
    }

    public ParteDiarioDetalle findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ParteDiarioDetalle no encontrado con id: " + id));
    }

    public ParteDiarioDetalle save(ParteDiarioDetalle entity) {
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("ParteDiarioDetalle no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }
}
