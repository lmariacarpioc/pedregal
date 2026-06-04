package com.pedregal.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entidad Trabajador.
 * Representa a un colaborador/operario de campo en el sistema El Pedregal.
 * El ID es un UUID generado por el dispositivo móvil (offline-first).
 */
@Entity
@Table(name = "trabajadores", uniqueConstraints = {
        @UniqueConstraint(columnNames = "dni", name = "uk_trabajador_dni")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trabajador {

    @Id
    @Column(length = 36, nullable = false, updatable = false)
    private String id;

    @NotBlank(message = "El nombre completo es obligatorio")
    @Size(max = 150)
    @Column(name = "nombre_completo", nullable = false, length = 150)
    private String nombreCompleto;

    @NotBlank(message = "El DNI es obligatorio")
    @Size(min = 8, max = 15)
    @Column(nullable = false, length = 15)
    private String dni;

    @Size(max = 100)
    @Column(name = "labor_asignada", length = 100)
    private String laborAsignada;

    @Size(max = 100)
    @Column(length = 100)
    private String cuadrilla;

    @Column(name = "activo", nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
