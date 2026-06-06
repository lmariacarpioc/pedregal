package com.pedregal.backend.service;

import com.pedregal.backend.entity.ParteDiario;
import com.pedregal.backend.repository.ParteDiarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParteDiarioService {

    private final ParteDiarioRepository repository;

    public List<ParteDiario> findAll() {
        return repository.findAll();
    }

    public ParteDiario findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("ParteDiario no encontrado con id: " + id));
    }

    public ParteDiario save(ParteDiario entity) {
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("ParteDiario no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }
}