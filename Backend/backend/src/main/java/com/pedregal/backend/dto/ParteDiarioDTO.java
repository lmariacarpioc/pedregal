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
    private String fecha; // yyyy-MM-dd
    private String turno; // AM, PM, NOCHE
    private String clima; // SOLEADO, NUBLADO, LLUVIOSO
    private String observacionesGenerales;
    private String estado; // BORRADOR, ENVIADO, APROBADO
    private List<ParteDiarioDetalleDTO> detalles;
}
