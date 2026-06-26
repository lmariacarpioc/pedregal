package com.pedregal.backend.service;

import com.pedregal.backend.entity.Trabajador;
import com.pedregal.backend.exception.ResourceNotFoundException;
import com.pedregal.backend.repository.TrabajadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrabajadorService {

    private final TrabajadorRepository repository;
    private final com.pedregal.backend.repository.UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<Trabajador> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Trabajador> findActivos() {
        return repository.findByActivoTrue();
    }

    @Transactional(readOnly = true)
    public Trabajador findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trabajador", id));
    }

    @Transactional
    public Trabajador save(Trabajador entity, Long jefeId, String jefeSyncId) {
        if (jefeId != null) {
            com.pedregal.backend.entity.Usuario jefe = usuarioRepository.findById(jefeId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario (Jefe)", jefeId));
            entity.setJefe(jefe);
        } else if (jefeSyncId != null && !jefeSyncId.isEmpty()) {
            com.pedregal.backend.entity.Usuario jefe = usuarioRepository.findBySyncId(jefeSyncId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario (Jefe SyncId)", 0L));
            entity.setJefe(jefe);
        } else {
            entity.setJefe(null);
        }
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Trabajador", id);
        }
        repository.deleteById(id);
    }
}