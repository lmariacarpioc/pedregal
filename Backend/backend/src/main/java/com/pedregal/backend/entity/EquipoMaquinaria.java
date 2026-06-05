package com.pedregal.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "equipos_maquinaria")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquipoMaquinaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String codigo;

    @Column(nullable = false)
    private String nombre;

    private String tipo; // EXCAVADORA, VOLQUETE, CARGADOR, COMPACTADORA, OTROS

    private String placa;

    private String estado; // OPERATIVO, EN_MANTENIMIENTO, INACTIVO

    @Column(name = "operador_asignado")
    private String operadorAsignado;

    @Column(name = "horometro_actual")
    private Double horometroActual;

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
