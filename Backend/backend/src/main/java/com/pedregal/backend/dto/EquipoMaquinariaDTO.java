package com.pedregal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipoMaquinariaDTO {
    private String syncId;
    private String codigo;
    private String nombre;
    private String tipo; // EXCAVADORA, VOLQUETE, CARGADOR, COMPACTADORA, OTROS
    private String placa;
    private String estado; // OPERATIVO, EN_MANTENIMIENTO, INACTIVO
    private String operadorAsignado;
    private Double horometroActual;
}
