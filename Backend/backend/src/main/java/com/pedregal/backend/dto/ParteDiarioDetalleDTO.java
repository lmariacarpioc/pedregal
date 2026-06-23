package com.pedregal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParteDiarioDetalleDTO {
    private String syncId;
    private String parteDiarioSyncId;
    private String trabajadorSyncId;
    private String horaEntrada;
    private String horaSalida;
    private String tareaRealizada;
    private String estadoAsistencia;
    private String observaciones;
    private Double cantidad;
    private String tipoActividad;
}