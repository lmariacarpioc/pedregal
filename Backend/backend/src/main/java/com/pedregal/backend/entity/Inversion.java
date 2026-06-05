package com.pedregal.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "inversiones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inversion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String concepto;

    private String categoria; // MATERIAL, EQUIPO, TRANSPORTE, ALIMENTACION, OTROS

    @Column(nullable = false)
    private Double monto;

    @Column(name = "fecha_gasto", nullable = false)
    private LocalDate fechaGasto;

    private String proveedor;

    @Column(name = "numero_factura")
    private String numeroFactura;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private String estado; // PENDIENTE, APROBADO, RECHAZADO

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
