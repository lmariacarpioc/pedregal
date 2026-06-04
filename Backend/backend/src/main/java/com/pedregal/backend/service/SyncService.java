package com.pedregal.backend.service;

import com.pedregal.backend.dto.SyncResultResponse;
import com.pedregal.backend.entity.RegistroCosecha;
import com.pedregal.backend.repository.RegistroCosechaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Servicio de Sincronización.
 *
 * Procesa el JSON masivo que envía la app móvil cuando recupera señal.
 * Lógica clave:
 * 1. Recibe una lista de registros con UUIDs generados offline.
 * 2. Para CADA registro, verifica si su UUID ya existe en la BD.
 * 3. Si NO existe → lo guarda (es nuevo).
 * 4. Si YA existe → lo ignora (el internet parpadeó y el móvil reenvió).
 * 5. Retorna un resumen: cuántos nuevos, cuántos duplicados, cuántos errores.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SyncService {

    private final RegistroCosechaRepository registroRepository;

    @Transactional
    public SyncResultResponse procesarSincronizacion(List<RegistroCosecha> registrosEntrantes) {

        int nuevos = 0;
        int duplicados = 0;
        int errores = 0;
        List<String> idsNuevos = new ArrayList<>();
        List<String> idsDuplicados = new ArrayList<>();
        List<String> detallesErrores = new ArrayList<>();

        log.info("══════════════════════════════════════════════════");
        log.info("  SINCRONIZACIÓN INICIADA");
        log.info("  Registros recibidos: {}", registrosEntrantes.size());
        log.info("══════════════════════════════════════════════════");

        for (RegistroCosecha registro : registrosEntrantes) {
            try {
                // ── Verificar si el UUID ya existe (anti-duplicado) ──
                if (registroRepository.existsById(registro.getId())) {
                    duplicados++;
                    idsDuplicados.add(registro.getId());
                    log.debug("  ⏭ Duplicado ignorado: {}", registro.getId());
                    continue;
                }

                // ── Estampar la fecha de llegada al servidor ──
                registro.setFechaSubidaNube(LocalDateTime.now());

                // ── Asegurar que el origen esté marcado ──
                if (registro.getOrigen() == null || registro.getOrigen().isBlank()) {
                    registro.setOrigen("MOVIL");
                }

                // ── Calcular rendimiento si no viene calculado ──
                if (registro.getRendimientoPorcentaje() == null
                        && registro.getCantidad() != null
                        && registro.getMetaBase() != null) {
                    var rendimiento = registro.getCantidad()
                            .divide(registro.getMetaBase(), 2, java.math.RoundingMode.HALF_UP)
                            .multiply(java.math.BigDecimal.valueOf(100));
                    registro.setRendimientoPorcentaje(rendimiento);
                }

                // ── Guardar el registro nuevo ──
                registroRepository.save(registro);
                nuevos++;
                idsNuevos.add(registro.getId());
                log.debug("  ✔ Guardado nuevo: {}", registro.getId());

            } catch (Exception e) {
                errores++;
                String detalle = "Error en registro " + registro.getId() + ": " + e.getMessage();
                detallesErrores.add(detalle);
                log.error("  ✖ {}", detalle);
            }
        }

        log.info("══════════════════════════════════════════════════");
        log.info("  SINCRONIZACIÓN COMPLETADA");
        log.info("  Nuevos: {} | Duplicados: {} | Errores: {}", nuevos, duplicados, errores);
        log.info("══════════════════════════════════════════════════");

        return SyncResultResponse.builder()
                .totalRecibidos(registrosEntrantes.size())
                .nuevosGuardados(nuevos)
                .duplicadosIgnorados(duplicados)
                .errores(errores)
                .idsNuevos(idsNuevos)
                .idsDuplicados(idsDuplicados)
                .detallesErrores(detallesErrores)
                .timestampServidor(LocalDateTime.now())
                .build();
    }

    @Transactional(readOnly = true)
    public List<RegistroCosecha> obtenerTodos() {
        return registroRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<RegistroCosecha> obtenerPorDispositivo(String deviceId) {
        return registroRepository.findByDeviceId(deviceId);
    }

    @Transactional(readOnly = true)
    public List<RegistroCosecha> obtenerPorTrabajador(String dni) {
        return registroRepository.findByTrabajadorDni(dni);
    }
}
