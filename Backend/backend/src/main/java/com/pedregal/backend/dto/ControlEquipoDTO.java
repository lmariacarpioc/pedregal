package com.pedregal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ControlEquipoDTO {
    private String syncId;
    private String equipoSyncId;
    private String parteDiarioSyncId;
    private Double horometroInicio;
    private Double horometroFin;
    private Double horasTrabajadas;
    private Double combustibleConsumido;
    private String observaciones;
}