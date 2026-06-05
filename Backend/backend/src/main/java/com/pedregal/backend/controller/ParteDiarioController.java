package com.pedregal.backend.controller;

import com.pedregal.backend.entity.ParteDiario;
import com.pedregal.backend.service.ParteDiarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partes-diarios")
@RequiredArgsConstructor
public class ParteDiarioController {

    private final ParteDiarioService service;

    @GetMapping
    public ResponseEntity<List<ParteDiario>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParteDiario> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ParteDiario> create(@RequestBody ParteDiario entity) {
        return ResponseEntity.ok(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParteDiario> update(@PathVariable Long id, @RequestBody ParteDiario entity) {
        entity.setId(id);
        return ResponseEntity.ok(service.save(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
