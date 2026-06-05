package com.pedregal.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "staff_asignacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffAsignacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trabajador_id", nullable = false)
    private Trabajador trabajador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "punto_movil_id", nullable = false)
    private PuntoMovil puntoMovil;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parte_diario_id")
    private ParteDiario parteDiario;

    @Column(name = "fecha_asignacion", nullable = false)
    private LocalDate fechaAsignacion;

    private String turno;

    @Column(name = "funcion_asignada", columnDefinition = "TEXT")
    private String funcionAsignada;

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
