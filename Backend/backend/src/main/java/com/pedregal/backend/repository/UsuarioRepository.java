package com.pedregal.backend.repository;

import com.pedregal.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findBySyncId(String syncId);
    boolean existsBySyncId(String syncId);
    Optional<Usuario> findByUsername(String username);
    boolean existsByUsername(String username);
    List<Usuario> findByRol(String rol);
    List<Usuario> findByJefeId(Long jefeId);
    List<Usuario> findByActivoTrue();
}
