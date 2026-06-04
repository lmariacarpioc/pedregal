package com.pedregal.backend.controller;

import com.pedregal.backend.entity.Trabajador;
import com.pedregal.backend.service.TrabajadorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trabajadores")
@RequiredArgsConstructor
public class TrabajadorController {

    private final TrabajadorService trabajadorService;

    @GetMapping
    public ResponseEntity<List<Trabajador>> listarTodos() {
        return ResponseEntity.ok(trabajadorService.listarTodos());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Trabajador>> listarActivos() {
        return ResponseEntity.ok(trabajadorService.listarActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trabajador> buscarPorId(@PathVariable String id) {
        return trabajadorService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<Trabajador> buscarPorDni(@PathVariable String dni) {
        return trabajadorService.buscarPorDni(dni)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Trabajador> crear(@Valid @RequestBody Trabajador trabajador) {
        Trabajador guardado = trabajadorService.guardar(trabajador);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trabajador> actualizar(@PathVariable String id,
            @Valid @RequestBody Trabajador trabajador) {
        Trabajador actualizado = trabajadorService.actualizar(id, trabajador);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        trabajadorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
