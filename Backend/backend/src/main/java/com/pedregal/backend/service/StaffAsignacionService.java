package com.pedregal.backend.service;

import com.pedregal.backend.entity.StaffAsignacion;
import com.pedregal.backend.repository.StaffAsignacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffAsignacionService {

    private final StaffAsignacionRepository repository;

    public List<StaffAsignacion> findAll() {
        return repository.findAll();
    }

    public StaffAsignacion findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("StaffAsignacion no encontrado con id: " + id));
    }

    public StaffAsignacion save(StaffAsignacion entity) {
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("StaffAsignacion no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }
}
