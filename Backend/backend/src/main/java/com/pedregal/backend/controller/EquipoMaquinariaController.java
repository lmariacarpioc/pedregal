package com.pedregal.backend.controller;

import com.pedregal.backend.entity.EquipoMaquinaria;
import com.pedregal.backend.service.EquipoMaquinariaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos-maquinaria")
@RequiredArgsConstructor
public class EquipoMaquinariaController {

    private final EquipoMaquinariaService service;

    @GetMapping
    public ResponseEntity<List<EquipoMaquinaria>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipoMaquinaria> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<EquipoMaquinaria> create(@RequestBody EquipoMaquinaria entity) {
        return ResponseEntity.ok(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipoMaquinaria> update(@PathVariable Long id, @RequestBody EquipoMaquinaria entity) {
        entity.setId(id);
        return ResponseEntity.ok(service.save(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
