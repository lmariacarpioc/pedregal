package com.pedregal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParteDiarioDTO {
    private String syncId;
    private String usuarioSyncId;
    private String fecha;
    private String turno;
    private String clima;
    private String observacionesGenerales;
    private String estado;
    private List<ParteDiarioDetalleDTO> detalles;
}