package com.pedregal.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "produccion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parte_diario_id")
    private ParteDiario parteDiario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "punto_movil_id")
    private PuntoMovil puntoMovil;

    @Column(nullable = false)
    private String actividad;

    @Column(name = "unidad_medida")
    private String unidadMedida;

    @Column(name = "cantidad_programada")
    private Double cantidadProgramada;

    @Column(name = "cantidad_ejecutada")
    private Double cantidadEjecutada;

    private Double rendimiento;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

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