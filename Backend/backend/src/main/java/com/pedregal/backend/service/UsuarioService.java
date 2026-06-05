package com.pedregal.backend.service;

import com.pedregal.backend.entity.Usuario;
import com.pedregal.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;

    public List<Usuario> findAll() {
        return repository.findAll();
    }

    public Usuario findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }

    public Usuario save(Usuario entity) {
        // Here we could add logic to ensure:
        // Si rol es SUPERVISOR, debe tener un JEFE_CAMPO como jefe_id
        // Si rol es ASISTENTE, debe tener un SUPERVISOR como jefe_id
        if (entity.getJefe() != null) {
            Usuario jefe = repository.findById(entity.getJefe().getId())
                    .orElseThrow(() -> new RuntimeException("Jefe no encontrado"));
            
            if ("SUPERVISOR".equals(entity.getRol()) && !"JEFE_CAMPO".equals(jefe.getRol())) {
                throw new IllegalArgumentException("El jefe de un Supervisor debe ser un Jefe de Campo");
            }
            if ("ASISTENTE".equals(entity.getRol()) && !"SUPERVISOR".equals(jefe.getRol())) {
                throw new IllegalArgumentException("El jefe de un Asistente debe ser un Supervisor");
            }
        }
        return repository.save(entity);
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con id: " + id);
        }
        repository.deleteById(id);
    }
}
