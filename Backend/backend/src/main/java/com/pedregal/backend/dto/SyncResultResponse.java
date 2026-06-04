package com.pedregal.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO de respuesta del endpoint de sincronización.
 * Le dice al móvil exactamente qué pasó con cada registro que envió.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SyncResultResponse {

    /** Total de registros que llegaron en el JSON del móvil */
    private int totalRecibidos;

    /** Registros que se guardaron exitosamente (eran nuevos) */
    private int nuevosGuardados;

    /** Registros ignorados porque su UUID ya existía en la BD */
    private int duplicadosIgnorados;

    /** Registros que fallaron al procesarse */
    private int errores;

    /** Lista de UUIDs que fueron guardados exitosamente */
    private List<String> idsNuevos;

    /** Lista de UUIDs que ya existían (duplicados) */
    private List<String> idsDuplicados;

    /** Detalle de errores para cada registro que falló */
    private List<String> detallesErrores;

    /** Hora del servidor al finalizar la sincronización */
    private LocalDateTime timestampServidor;
}
