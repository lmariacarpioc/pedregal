package com.pedregal.backend.controller;

import com.pedregal.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        boolean acceso = service.login(
                request.getUsuario(),
                request.getPassword()
        );

        if (acceso) {
            return "LOGIN CORRECTO";
        } else {
            return "USUARIO O CONTRASEÑA INCORRECTA";
        }
    }
}