package com.pedregal.backend.controller;

import com.pedregal.backend.entity.ControlEquipo;
import com.pedregal.backend.service.ControlEquipoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/control-equipos")
@RequiredArgsConstructor
public class ControlEquipoController {

    private final ControlEquipoService service;

    @GetMapping
    public ResponseEntity<List<ControlEquipo>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ControlEquipo> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ControlEquipo> create(@RequestBody ControlEquipo entity) {
        return ResponseEntity.ok(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ControlEquipo> update(@PathVariable Long id, @RequestBody ControlEquipo entity) {
        entity.setId(id);
        return ResponseEntity.ok(service.save(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
