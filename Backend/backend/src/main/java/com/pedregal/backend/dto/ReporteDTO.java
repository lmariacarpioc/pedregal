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
    private String tipoReporte;
    private String fechaInicio;
    private String fechaFin;
    private String contenido;
    private String conclusiones;
    private String estado;
}