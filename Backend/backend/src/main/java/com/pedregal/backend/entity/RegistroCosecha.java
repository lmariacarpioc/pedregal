package com.pedregal.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad principal del sistema: Registro de Cosecha.
 *
 * Cada registro nace en el celular del supervisor de campo.
 * El @Id es un UUID (String) generado OFFLINE por el dispositivo,
 * lo que elimina el riesgo de colisiones de llaves primarias
 * cuando múltiples dispositivos suben datos al mismo tiempo.
 *
 * Campos de negocio: cantidad, meta, rendimiento, lote, etc.
 * Campos de auditoría sync: deviceId, fechaSubidaNube, origen.
 */
@Entity
@Table(name = "registros_cosecha", indexes = {
        @Index(name = "idx_registro_fecha", columnList = "fecha_registro_local"),
        @Index(name = "idx_registro_device", columnList = "device_id"),
        @Index(name = "idx_registro_trabajador", columnList = "trabajador_dni")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroCosecha {

    // ═══════════════════════════════════════════
    // IDENTIFICADOR (UUID generado en el móvil)
    // ═══════════════════════════════════════════

    @Id
    @Column(length = 36, nullable = false, updatable = false)
    private String id;

    // ═══════════════════════════════════════════
    // CAMPOS DE NEGOCIO
    // ═══════════════════════════════════════════

    @NotBlank(message = "El DNI del trabajador es obligatorio")
    @Column(name = "trabajador_dni", nullable = false, length = 15)
    private String trabajadorDni;

    @NotBlank(message = "El nombre del trabajador es obligatorio")
    @Column(name = "trabajador_nombre", nullable = false, length = 150)
    private String trabajadorNombre;

    @NotNull(message = "La cantidad cosechada es obligatoria")
    @DecimalMin(value = "0.0", message = "La cantidad no puede ser negativa")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cantidad;

    @NotNull(message = "La meta base es obligatoria")
    @DecimalMin(value = "0.1", message = "La meta debe ser mayor a cero")
    @Column(name = "meta_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal metaBase;

    @Column(name = "rendimiento_porcentaje", precision = 6, scale = 2)
    private BigDecimal rendimientoPorcentaje;

    @Size(max = 100)
    @Column(length = 100)
    private String lote;

    @Size(max = 100)
    @Column(length = 100)
    private String fundo;

    @Size(max = 100)
    @Column(name = "labor", length = 100)
    private String labor;

    @Size(max = 100)
    @Column(length = 100)
    private String cuadrilla;

    @Size(max = 500)
    @Column(length = 500)
    private String observaciones;

    // ═══════════════════════════════════════════
    // CAMPOS DE AUDITORÍA / SINCRONIZACIÓN
    // ═══════════════════════════════════════════

    /**
     * Fecha/hora en que el supervisor registró los datos en campo.
     * Capturada por el reloj LOCAL del celular (puede no tener zona horaria
     * exacta).
     */
    @NotNull(message = "La fecha de registro local es obligatoria")
    @Column(name = "fecha_registro_local", nullable = false)
    private LocalDateTime fechaRegistroLocal;

    /**
     * Fecha del día de trabajo (sin hora). Útil para agrupar por jornada.
     */
    @Column(name = "fecha_jornada")
    private LocalDate fechaJornada;

    /**
     * Identificador único del dispositivo que generó este registro.
     * Permite rastrear desde qué celular vino cada dato.
     */
    @NotBlank(message = "El deviceId es obligatorio")
    @Column(name = "device_id", nullable = false, length = 100)
    private String deviceId;

    /**
     * Momento exacto en que el registro llegó al servidor (nube).
     * Se establece automáticamente al procesar la sincronización.
     */
    @Column(name = "fecha_subida_nube")
    private LocalDateTime fechaSubidaNube;

    /**
     * Origen del registro: "MOVIL" (vía sync), "WEB" (carga manual), etc.
     */
    @Column(length = 20, nullable = false)
    @Builder.Default
    private String origen = "MOVIL";

    /**
     * Timestamp de creación en la BD central (auditoría del servidor).
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
