package com.pedregal.backend.controller;

import com.pedregal.backend.dto.TrabajadorDTO;
import com.pedregal.backend.entity.Trabajador;
import com.pedregal.backend.service.TrabajadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trabajadores")
@RequiredArgsConstructor
public class TrabajadorController {

    private final TrabajadorService service;

    @GetMapping
    public ResponseEntity<List<TrabajadorDTO>> getAll() {
        return ResponseEntity.ok(service.findAll().stream().map(this::mapToDto).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrabajadorDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mapToDto(service.findById(id)));
    }

    @PostMapping
    public ResponseEntity<TrabajadorDTO> create(@RequestBody TrabajadorDTO dto) {
        Trabajador entity = mapToEntity(dto);
        Trabajador saved = service.save(entity, dto.getJefeId(), dto.getJefeSyncId());
        return ResponseEntity.ok(mapToDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrabajadorDTO> update(@PathVariable Long id, @RequestBody TrabajadorDTO dto) {
        Trabajador entity = mapToEntity(dto);
        entity.setId(id);
        Trabajador saved = service.save(entity, dto.getJefeId(), dto.getJefeSyncId());
        return ResponseEntity.ok(mapToDto(saved));
    }

    private Trabajador mapToEntity(TrabajadorDTO dto) {
        Trabajador t = new Trabajador();
        t.setSyncId(dto.getSyncId());
        t.setNombre(dto.getNombre());
        t.setApellido(dto.getApellido());
        t.setDni(dto.getDni());
        t.setCargo(dto.getCargo());
        t.setAreaTrabajo(dto.getAreaTrabajo());
        t.setTelefono(dto.getTelefono());
        t.setCategoria(dto.getCategoria());
        t.setSalarioDiario(dto.getSalarioDiario());
        t.setActivo(dto.isActivo());
        return t;
    }

    private TrabajadorDTO mapToDto(Trabajador t) {
        TrabajadorDTO dto = new TrabajadorDTO();
        dto.setId(t.getId());
        dto.setSyncId(t.getSyncId());
        dto.setNombre(t.getNombre());
        dto.setApellido(t.getApellido());
        dto.setDni(t.getDni());
        dto.setCargo(t.getCargo());
        dto.setAreaTrabajo(t.getAreaTrabajo());
        dto.setTelefono(t.getTelefono());
        dto.setCategoria(t.getCategoria());
        dto.setSalarioDiario(t.getSalarioDiario());
        dto.setActivo(t.isActivo());
        if (t.getJefe() != null) {
            dto.setJefeId(t.getJefe().getId());
            dto.setJefeSyncId(t.getJefe().getSyncId());
        }
        return dto;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}