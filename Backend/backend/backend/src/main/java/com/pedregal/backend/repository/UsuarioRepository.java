package com.pedregal.backend.repository;

import com.pedregal.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByUsuario(String usuario);

}