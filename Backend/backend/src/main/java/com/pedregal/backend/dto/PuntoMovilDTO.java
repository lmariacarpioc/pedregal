package com.pedregal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PuntoMovilDTO {
    private String syncId;
    private String codigo;
    private String nombre;
    private String descripcion;
    private String tipo; // CHECKPOINT, FRENTE_TRABAJO, ALMACEN, CAMPAMENTO
    private Double latitud;
    private Double longitud;
    private Double altitud;
    private boolean activo;
}
