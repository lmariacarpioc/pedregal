package com.pedregal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReporteDTO {
    private String syncId;
    private String usuarioSyncId;
    private String titulo;
    private String tipoReporte; // DIARIO, SEMANAL, MENSUAL, INCIDENTE, AVANCE
    private String fechaInicio; // yyyy-MM-dd
    private String fechaFin;   // yyyy-MM-dd
    private String contenido;
    private String conclusiones;
    private String estado; // BORRADOR, ENVIADO, REVISADO
}
