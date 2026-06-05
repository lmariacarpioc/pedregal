package com.pedregal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrabajadorDTO {
    private String syncId;
    private String nombre;
    private String apellido;
    private String dni;
    private String cargo;
    private String areaTrabajo;
    private String telefono;
    private String categoria; // OBRERO, EMPLEADO, CONTRATISTA
    private Double salarioDiario;
    private boolean activo;
}
