package com.pedregal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProduccionDTO {
    private String syncId;
    private String parteDiarioSyncId;
    private String puntoMovilSyncId;
    private String actividad;
    private String unidadMedida;
    private Double cantidadProgramada;
    private Double cantidadEjecutada;
    private Double rendimiento;
    private String observaciones;
}