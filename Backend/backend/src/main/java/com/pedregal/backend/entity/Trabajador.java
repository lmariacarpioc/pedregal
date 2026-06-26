package com.pedregal.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "trabajadores")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Trabajador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(unique = true, nullable = false)
    private String dni;

    private String cargo;

    @Column(name = "area_trabajo")
    private String areaTrabajo;

    @Column(name = "telefono")
    private String telefono;

    private String categoria;

    @Column(name = "salario_diario")
    private Double salarioDiario;

    private boolean activo = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jefe_id")
    private Usuario jefe;

    @Column(name = "sync_id", unique = true)
    private String syncId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}