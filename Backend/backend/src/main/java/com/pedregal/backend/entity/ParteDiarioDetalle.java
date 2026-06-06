package com.pedregal.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "parte_diario_detalle")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParteDiarioDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parte_diario_id", nullable = false)
    private ParteDiario parteDiario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trabajador_id", nullable = false)
    private Trabajador trabajador;

    @Column(name = "hora_entrada")
    private String horaEntrada;

    @Column(name = "hora_salida")
    private String horaSalida;

    @Column(name = "tarea_realizada", columnDefinition = "TEXT")
    private String tareaRealizada;

    @Column(name = "estado_asistencia")
    private String estadoAsistencia;

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