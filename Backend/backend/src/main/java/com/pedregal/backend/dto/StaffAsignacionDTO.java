package com.pedregal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffAsignacionDTO {
    private String syncId;
    private String trabajadorSyncId;
    private String puntoMovilSyncId;
    private String parteDiarioSyncId;
    private String fechaAsignacion;
    private String turno;
    private String funcionAsignada;
}