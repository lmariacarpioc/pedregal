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
public class SyncPayloadDTO {
    private String dispositivoId;
    private String timestamp;
    private List<TrabajadorDTO> trabajadores;
    private List<ParteDiarioDTO> partesDiarios;
    private List<PuntoMovilDTO> puntosMoviles;
    private List<StaffAsignacionDTO> staffAsignaciones;
    private List<ReporteDTO> reportes;
    private List<InversionDTO> inversiones;
    private List<ProduccionDTO> produccion;
    private List<EquipoMaquinariaDTO> equipos;
    private List<ControlEquipoDTO> controlEquipos;
}
