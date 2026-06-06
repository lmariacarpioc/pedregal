package com.pedregal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InversionDTO {
    private String syncId;
    private String usuarioSyncId;
    private String concepto;
    private String categoria;
    private Double monto;
    private String fechaGasto;
    private String proveedor;
    private String numeroFactura;
    private String descripcion;
    private String estado;
}