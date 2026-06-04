package com.pedregal.backend.exception;

import lombok.*;

import java.time.LocalDateTime;

/**
 * DTO para respuestas de error estandarizadas.
 * Todos los errores de la API devuelven este formato JSON limpio
 * en lugar de stacktraces del servidor.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiErrorResponse {

    /** Código HTTP del error (400, 404, 500, etc.) */
    private int status;

    /** Tipo de error legible */
    private String error;

    /** Mensaje descriptivo del problema */
    private String mensaje;

    /** Ruta del endpoint que generó el error */
    private String path;

    /** Momento exacto del error */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
