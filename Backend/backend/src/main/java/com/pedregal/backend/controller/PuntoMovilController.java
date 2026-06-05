package com.pedregal.backend.controller;

import com.pedregal.backend.entity.PuntoMovil;
import com.pedregal.backend.service.PuntoMovilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/puntos-moviles")
@RequiredArgsConstructor
public class PuntoMovilController {

    private final PuntoMovilService service;

    @GetMapping
    public ResponseEntity<List<PuntoMovil>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PuntoMovil> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<PuntoMovil> create(@RequestBody PuntoMovil entity) {
        return ResponseEntity.ok(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PuntoMovil> update(@PathVariable Long id, @RequestBody PuntoMovil entity) {
        entity.setId(id);
        return ResponseEntity.ok(service.save(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
