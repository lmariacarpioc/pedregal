package com.pedregal.backend.service;

import com.pedregal.backend.entity.Usuario;
import com.pedregal.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    public boolean login(String usuario, String password) {

        Usuario u = repository.findByUsuario(usuario);

        if (u != null && u.getPassword().equals(password)) {
            return true;
        }

        return false;
    }
}