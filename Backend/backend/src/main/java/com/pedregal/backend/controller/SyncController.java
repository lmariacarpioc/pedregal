package com.pedregal.backend.controller;

import com.pedregal.backend.dto.SyncResultResponse;
import com.pedregal.backend.entity.RegistroCosecha;
import com.pedregal.backend.service.SyncService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de Sincronización.
 *
 * Este es el endpoint más importante de todo el backend.
 * La app móvil (Ionic) llama aquí cuando recupera señal de internet
 * y envía un JSON masivo con todos los registros capturados offline.
 *
 * Flujo:
 * 1. Móvil pierde señal → guarda registros en SQLite local.
 * 2. Móvil recupera señal → POST /api/sync con List<RegistroCosecha>.
 * 3. Este controller recibe, delega al SyncService.
 * 4. SyncService verifica duplicados y guarda los nuevos.
 * 5. Retorna SyncResultResponse para que el móvil marque como sincronizados.
 */
@RestController
@RequestMapping("/api/sync")
@RequiredArgsConstructor
@Slf4j
public class SyncController {

    private final SyncService syncService;

    /**
     * POST /api/sync
     *
     * Recibe el lote de registros desde el dispositivo móvil.
     * Cada registro tiene un UUID generado offline como ID.
     *
     * @param registros Lista de RegistroCosecha capturados en campo
     * @return SyncResultResponse con el resumen de la operación
     */
    @PostMapping
    public ResponseEntity<SyncResultResponse> sincronizar(
            @Valid @RequestBody List<RegistroCosecha> registros) {

        log.info("📱 Solicitud de sincronización recibida con {} registros", registros.size());

        if (registros.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    SyncResultResponse.builder()
                            .totalRecibidos(0)
                            .nuevosGuardados(0)
                            .duplicadosIgnorados(0)
                            .errores(0)
                            .detallesErrores(List.of("La lista de registros está vacía"))
                            .build());
        }

        SyncResultResponse resultado = syncService.procesarSincronizacion(registros);

        // Si hubo errores pero también éxitos → 207 Multi-Status
        // Si todo fue exitoso → 200 OK
        // Si todo falló → 422 Unprocessable
        HttpStatus status;
        if (resultado.getErrores() > 0 && resultado.getNuevosGuardados() > 0) {
            status = HttpStatus.MULTI_STATUS; // 207
        } else if (resultado.getErrores() > 0 && resultado.getNuevosGuardados() == 0) {
            status = HttpStatus.UNPROCESSABLE_ENTITY; // 422
        } else {
            status = HttpStatus.OK; // 200
        }

        return ResponseEntity.status(status).body(resultado);
    }

    /**
     * GET /api/sync/registros
     * Retorna todos los registros de cosecha (para que la web los consuma).
     */
    @GetMapping("/registros")
    public ResponseEntity<List<RegistroCosecha>> obtenerTodos() {
        return ResponseEntity.ok(syncService.obtenerTodos());
    }

    /**
     * GET /api/sync/registros/device/{deviceId}
     * Retorna registros filtrados por dispositivo.
     */
    @GetMapping("/registros/device/{deviceId}")
    public ResponseEntity<List<RegistroCosecha>> obtenerPorDispositivo(
            @PathVariable String deviceId) {
        return ResponseEntity.ok(syncService.obtenerPorDispositivo(deviceId));
    }

    /**
     * GET /api/sync/registros/trabajador/{dni}
     * Retorna registros filtrados por trabajador.
     */
    @GetMapping("/registros/trabajador/{dni}")
    public ResponseEntity<List<RegistroCosecha>> obtenerPorTrabajador(
            @PathVariable String dni) {
        return ResponseEntity.ok(syncService.obtenerPorTrabajador(dni));
    }
}
