package com.pedregal.backend.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.stream.Collectors;

/**
 * Manejador Global de Excepciones.
 *
 * Atrapa todas las excepciones que escapen de los controllers
 * y las convierte en respuestas JSON limpias y estandarizadas.
 * NUNCA se envían stacktraces al cliente.
 */
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // ═══════════════════════════════════════════
    // ERRORES DE VALIDACIÓN (@Valid)
    // ═══════════════════════════════════════════

    /**
     * Cuando un @RequestBody falla las validaciones (@NotBlank, @NotNull, etc.)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        String mensajes = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(" | "));

        log.warn("Validación fallida en {}: {}", request.getRequestURI(), mensajes);

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Error de Validación")
                .mensaje(mensajes)
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.badRequest().body(response);
    }

    // ═══════════════════════════════════════════
    // ERRORES DE BASE DE DATOS
    // ═══════════════════════════════════════════

    /**
     * Violación de integridad: llaves duplicadas, constraints, FK inválidas, etc.
     * Ejemplo: intentar guardar un Trabajador con un DNI que ya existe.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrity(
            DataIntegrityViolationException ex,
            HttpServletRequest request) {

        log.error("Violación de integridad en {}: {}", request.getRequestURI(), ex.getMostSpecificCause().getMessage());

        String mensaje = "Error de integridad en la base de datos. "
                + "Posible causa: registro duplicado o dato que viola una restricción.";

        // Intentar dar un mensaje más específico
        String causa = ex.getMostSpecificCause().getMessage();
        if (causa != null && causa.contains("uk_trabajador_dni")) {
            mensaje = "Ya existe un trabajador con ese DNI.";
        }

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.CONFLICT.value())
                .error("Conflicto de Datos")
                .mensaje(mensaje)
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    // ═══════════════════════════════════════════
    // JSON MALFORMADO
    // ═══════════════════════════════════════════

    /**
     * Cuando el JSON del request no se puede parsear.
     * Ejemplo: el móvil envía un JSON con formato incorrecto.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleBadJson(
            HttpMessageNotReadableException ex,
            HttpServletRequest request) {

        log.warn("JSON malformado en {}: {}", request.getRequestURI(), ex.getMessage());

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("JSON Inválido")
                .mensaje("El cuerpo de la solicitud no tiene un formato JSON válido. "
                        + "Revisa la estructura del JSON enviado.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.badRequest().body(response);
    }

    // ═══════════════════════════════════════════
    // RUNTIME EXCEPTIONS (Negocio)
    // ═══════════════════════════════════════════

    /**
     * Excepciones de lógica de negocio (ej: "Trabajador no encontrado").
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiErrorResponse> handleRuntime(
            RuntimeException ex,
            HttpServletRequest request) {

        log.error("Error de negocio en {}: {}", request.getRequestURI(), ex.getMessage());

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .error("Recurso no encontrado")
                .mensaje(ex.getMessage())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // ═══════════════════════════════════════════
    // CATCH-ALL (Errores inesperados)
    // ═══════════════════════════════════════════

    /**
     * Último recurso: cualquier error no previsto.
     * Logea el stacktrace completo pero NO lo envía al cliente.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneral(
            Exception ex,
            HttpServletRequest request) {

        log.error("Error inesperado en {}", request.getRequestURI(), ex);

        ApiErrorResponse response = ApiErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Error Interno del Servidor")
                .mensaje("Ocurrió un error inesperado. El equipo técnico ha sido notificado.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
