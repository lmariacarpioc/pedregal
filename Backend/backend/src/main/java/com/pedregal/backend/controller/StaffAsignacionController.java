package com.pedregal.backend.controller;

import com.pedregal.backend.entity.StaffAsignacion;
import com.pedregal.backend.service.StaffAsignacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff-asignaciones")
@RequiredArgsConstructor
public class StaffAsignacionController {

    private final StaffAsignacionService service;

    @GetMapping
    public ResponseEntity<List<StaffAsignacion>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffAsignacion> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<StaffAsignacion> create(@RequestBody StaffAsignacion entity) {
        return ResponseEntity.ok(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffAsignacion> update(@PathVariable Long id, @RequestBody StaffAsignacion entity) {
        entity.setId(id);
        return ResponseEntity.ok(service.save(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
