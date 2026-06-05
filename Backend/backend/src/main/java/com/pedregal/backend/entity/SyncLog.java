package com.pedregal.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sync_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SyncLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "dispositivo_id")
    private String dispositivoId;

    @Column(name = "fecha_sync", nullable = false)
    private LocalDateTime fechaSync;

    @Column(name = "tipo_sync")
    private String tipoSync; // UPLOAD, DOWNLOAD

    @Column(name = "total_registros")
    private Integer totalRegistros;

    @Column(name = "registros_creados")
    private Integer registrosCreados;

    @Column(name = "registros_actualizados")
    private Integer registrosActualizados;

    @Column(name = "registros_fallidos")
    private Integer registrosFallidos;

    private String estado; // EXITOSO, PARCIAL, FALLIDO

    @Column(columnDefinition = "TEXT")
    private String errores;

    @Column(name = "payload_resumen", columnDefinition = "TEXT")
    private String payloadResumen;
}
