package com.pedregal.backend.exception;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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

    /** Mensaje descriptivo del problema */
    private String message;

    /** Lista de errores detallados */
    private List<String> errors;

    /** Momento exacto del error */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
