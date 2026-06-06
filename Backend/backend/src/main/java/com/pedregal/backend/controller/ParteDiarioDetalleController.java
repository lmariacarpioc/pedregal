package com.pedregal.backend.controller;

import com.pedregal.backend.entity.ParteDiarioDetalle;
import com.pedregal.backend.service.ParteDiarioDetalleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partes-diarios-detalle")
@RequiredArgsConstructor
public class ParteDiarioDetalleController {

    private final ParteDiarioDetalleService service;

    @GetMapping
    public ResponseEntity<List<ParteDiarioDetalle>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParteDiarioDetalle> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ParteDiarioDetalle> create(@RequestBody ParteDiarioDetalle entity) {
        return ResponseEntity.ok(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParteDiarioDetalle> update(@PathVariable Long id, @RequestBody ParteDiarioDetalle entity) {
        entity.setId(id);
        return ResponseEntity.ok(service.save(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}