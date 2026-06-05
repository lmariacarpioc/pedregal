package com.pedregal.backend.service;

import com.pedregal.backend.dto.*;
import com.pedregal.backend.entity.*;
import com.pedregal.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SyncService {

    private final UsuarioRepository usuarioRepository;
    private final TrabajadorRepository trabajadorRepository;
    private final ParteDiarioRepository parteDiarioRepository;
    private final ParteDiarioDetalleRepository parteDiarioDetalleRepository;
    private final PuntoMovilRepository puntoMovilRepository;
    private final StaffAsignacionRepository staffAsignacionRepository;
    private final ReporteRepository reporteRepository;
    private final InversionRepository inversionRepository;
    private final ProduccionRepository produccionRepository;
    private final EquipoMaquinariaRepository equipoMaquinariaRepository;
    private final ControlEquipoRepository controlEquipoRepository;
    private final SyncLogRepository syncLogRepository;

    @Transactional
    public SyncResultDTO processSync(SyncPayloadDTO payload) {
        List<String> errors = new ArrayList<>();
        int created = 0, updated = 0, failed = 0;

        try {
            // ── 1. Sincronizar Trabajadores ──
            if (payload.getTrabajadores() != null) {
                for (TrabajadorDTO dto : payload.getTrabajadores()) {
                    try {
                        if (dto.getSyncId() != null && trabajadorRepository.existsBySyncId(dto.getSyncId())) {
                            Trabajador existing = trabajadorRepository.findBySyncId(dto.getSyncId()).get();
                            existing.setNombre(dto.getNombre());
                            existing.setApellido(dto.getApellido());
                            existing.setDni(dto.getDni());
                            existing.setCargo(dto.getCargo());
                            existing.setAreaTrabajo(dto.getAreaTrabajo());
                            existing.setTelefono(dto.getTelefono());
                            existing.setCategoria(dto.getCategoria());
                            existing.setSalarioDiario(dto.getSalarioDiario());
                            existing.setActivo(dto.isActivo());
                            trabajadorRepository.save(existing);
                            updated++;
                        } else {
                            Trabajador nuevo = new Trabajador();
                            nuevo.setSyncId(dto.getSyncId());
                            nuevo.setNombre(dto.getNombre());
                            nuevo.setApellido(dto.getApellido());
                            nuevo.setDni(dto.getDni());
                            nuevo.setCargo(dto.getCargo());
                            nuevo.setAreaTrabajo(dto.getAreaTrabajo());
                            nuevo.setTelefono(dto.getTelefono());
                            nuevo.setCategoria(dto.getCategoria());
                            nuevo.setSalarioDiario(dto.getSalarioDiario());
                            nuevo.setActivo(dto.isActivo());
                            trabajadorRepository.save(nuevo);
                            created++;
                        }
                    } catch (Exception e) {
                        failed++;
                        errors.add("Trabajador [" + dto.getSyncId() + "]: " + e.getMessage());
                        log.error("Error sincronizando trabajador {}", dto.getSyncId(), e);
                    }
                }
            }

            // ── 2. Sincronizar Puntos Móviles ──
            if (payload.getPuntosMoviles() != null) {
                for (PuntoMovilDTO dto : payload.getPuntosMoviles()) {
                    try {
                        if (dto.getSyncId() != null && puntoMovilRepository.existsBySyncId(dto.getSyncId())) {
                            PuntoMovil existing = puntoMovilRepository.findBySyncId(dto.getSyncId()).get();
                            existing.setCodigo(dto.getCodigo());
                            existing.setNombre(dto.getNombre());
                            existing.setDescripcion(dto.getDescripcion());
                            existing.setTipo(dto.getTipo());
                            existing.setLatitud(dto.getLatitud());
                            existing.setLongitud(dto.getLongitud());
                            existing.setAltitud(dto.getAltitud());
                            existing.setActivo(dto.isActivo());
                            puntoMovilRepository.save(existing);
                            updated++;
                        } else {
                            PuntoMovil nuevo = new PuntoMovil();
                            nuevo.setSyncId(dto.getSyncId());
                            nuevo.setCodigo(dto.getCodigo());
                            nuevo.setNombre(dto.getNombre());
                            nuevo.setDescripcion(dto.getDescripcion());
                            nuevo.setTipo(dto.getTipo());
                            nuevo.setLatitud(dto.getLatitud());
                            nuevo.setLongitud(dto.getLongitud());
                            nuevo.setAltitud(dto.getAltitud());
                            nuevo.setActivo(dto.isActivo());
                            puntoMovilRepository.save(nuevo);
                            created++;
                        }
                    } catch (Exception e) {
                        failed++;
                        errors.add("PuntoMovil [" + dto.getSyncId() + "]: " + e.getMessage());
                        log.error("Error sincronizando punto movil {}", dto.getSyncId(), e);
                    }
                }
            }

            // ── 3. Sincronizar Partes Diarios (con detalles anidados) ──
            if (payload.getPartesDiarios() != null) {
                for (ParteDiarioDTO dto : payload.getPartesDiarios()) {
                    try {
                        ParteDiario parte;
                        if (dto.getSyncId() != null && parteDiarioRepository.existsBySyncId(dto.getSyncId())) {
                            parte = parteDiarioRepository.findBySyncId(dto.getSyncId()).get();
                            updated++;
                        } else {
                            parte = new ParteDiario();
                            parte.setSyncId(dto.getSyncId());
                            created++;
                        }
                        parte.setFecha(LocalDate.parse(dto.getFecha()));
                        parte.setTurno(dto.getTurno());
                        parte.setClima(dto.getClima());
                        parte.setObservacionesGenerales(dto.getObservacionesGenerales());
                        parte.setEstado(dto.getEstado());

                        // Vincular usuario si existe
                        if (dto.getUsuarioSyncId() != null) {
                            usuarioRepository.findBySyncId(dto.getUsuarioSyncId())
                                    .ifPresent(parte::setUsuario);
                        }
                        parte = parteDiarioRepository.save(parte);

                        // Procesar detalles del parte diario
                        if (dto.getDetalles() != null) {
                            for (ParteDiarioDetalleDTO detDto : dto.getDetalles()) {
                                try {
                                    ParteDiarioDetalle detalle;
                                    if (detDto.getSyncId() != null && parteDiarioDetalleRepository.existsBySyncId(detDto.getSyncId())) {
                                        detalle = parteDiarioDetalleRepository.findBySyncId(detDto.getSyncId()).get();
                                        updated++;
                                    } else {
                                        detalle = new ParteDiarioDetalle();
                                        detalle.setSyncId(detDto.getSyncId());
                                        created++;
                                    }
                                    detalle.setParteDiario(parte);
                                    detalle.setHoraEntrada(detDto.getHoraEntrada());
                                    detalle.setHoraSalida(detDto.getHoraSalida());
                                    detalle.setTareaRealizada(detDto.getTareaRealizada());
                                    detalle.setEstadoAsistencia(detDto.getEstadoAsistencia());
                                    detalle.setObservaciones(detDto.getObservaciones());

                                    if (detDto.getTrabajadorSyncId() != null) {
                                        trabajadorRepository.findBySyncId(detDto.getTrabajadorSyncId())
                                                .ifPresent(detalle::setTrabajador);
                                    }
                                    parteDiarioDetalleRepository.save(detalle);
                                } catch (Exception e) {
                                    failed++;
                                    errors.add("ParteDiarioDetalle [" + detDto.getSyncId() + "]: " + e.getMessage());
                                }
                            }
                        }
                    } catch (Exception e) {
                        failed++;
                        errors.add("ParteDiario [" + dto.getSyncId() + "]: " + e.getMessage());
                        log.error("Error sincronizando parte diario {}", dto.getSyncId(), e);
                    }
                }
            }

            // ── 4. Sincronizar Staff Asignaciones ──
            if (payload.getStaffAsignaciones() != null) {
                for (StaffAsignacionDTO dto : payload.getStaffAsignaciones()) {
                    try {
                        StaffAsignacion asignacion;
                        if (dto.getSyncId() != null && staffAsignacionRepository.existsBySyncId(dto.getSyncId())) {
                            asignacion = staffAsignacionRepository.findBySyncId(dto.getSyncId()).get();
                            updated++;
                        } else {
                            asignacion = new StaffAsignacion();
                            asignacion.setSyncId(dto.getSyncId());
                            created++;
                        }
                        asignacion.setFechaAsignacion(LocalDate.parse(dto.getFechaAsignacion()));
                        asignacion.setTurno(dto.getTurno());
                        asignacion.setFuncionAsignada(dto.getFuncionAsignada());

                        if (dto.getTrabajadorSyncId() != null) {
                            trabajadorRepository.findBySyncId(dto.getTrabajadorSyncId())
                                    .ifPresent(asignacion::setTrabajador);
                        }
                        if (dto.getPuntoMovilSyncId() != null) {
                            puntoMovilRepository.findBySyncId(dto.getPuntoMovilSyncId())
                                    .ifPresent(asignacion::setPuntoMovil);
                        }
                        if (dto.getParteDiarioSyncId() != null) {
                            parteDiarioRepository.findBySyncId(dto.getParteDiarioSyncId())
                                    .ifPresent(asignacion::setParteDiario);
                        }
                        staffAsignacionRepository.save(asignacion);
                    } catch (Exception e) {
                        failed++;
                        errors.add("StaffAsignacion [" + dto.getSyncId() + "]: " + e.getMessage());
                    }
                }
            }

            // ── 5. Sincronizar Reportes ──
            if (payload.getReportes() != null) {
                for (ReporteDTO dto : payload.getReportes()) {
                    try {
                        Reporte reporte;
                        if (dto.getSyncId() != null && reporteRepository.existsBySyncId(dto.getSyncId())) {
                            reporte = reporteRepository.findBySyncId(dto.getSyncId()).get();
                            updated++;
                        } else {
                            reporte = new Reporte();
                            reporte.setSyncId(dto.getSyncId());
                            created++;
                        }
                        reporte.setTitulo(dto.getTitulo());
                        reporte.setTipoReporte(dto.getTipoReporte());
                        reporte.setFechaInicio(dto.getFechaInicio() != null ? LocalDate.parse(dto.getFechaInicio()) : null);
                        reporte.setFechaFin(dto.getFechaFin() != null ? LocalDate.parse(dto.getFechaFin()) : null);
                        reporte.setContenido(dto.getContenido());
                        reporte.setConclusiones(dto.getConclusiones());
                        reporte.setEstado(dto.getEstado());

                        if (dto.getUsuarioSyncId() != null) {
                            usuarioRepository.findBySyncId(dto.getUsuarioSyncId())
                                    .ifPresent(reporte::setUsuario);
                        }
                        reporteRepository.save(reporte);
                    } catch (Exception e) {
                        failed++;
                        errors.add("Reporte [" + dto.getSyncId() + "]: " + e.getMessage());
                    }
                }
            }

            // ── 6. Sincronizar Inversiones ──
            if (payload.getInversiones() != null) {
                for (InversionDTO dto : payload.getInversiones()) {
                    try {
                        Inversion inversion;
                        if (dto.getSyncId() != null && inversionRepository.existsBySyncId(dto.getSyncId())) {
                            inversion = inversionRepository.findBySyncId(dto.getSyncId()).get();
                            updated++;
                        } else {
                            inversion = new Inversion();
                            inversion.setSyncId(dto.getSyncId());
                            created++;
                        }
                        inversion.setConcepto(dto.getConcepto());
                        inversion.setCategoria(dto.getCategoria());
                        inversion.setMonto(dto.getMonto());
                        inversion.setFechaGasto(LocalDate.parse(dto.getFechaGasto()));
                        inversion.setProveedor(dto.getProveedor());
                        inversion.setNumeroFactura(dto.getNumeroFactura());
                        inversion.setDescripcion(dto.getDescripcion());
                        inversion.setEstado(dto.getEstado());

                        if (dto.getUsuarioSyncId() != null) {
                            usuarioRepository.findBySyncId(dto.getUsuarioSyncId())
                                    .ifPresent(inversion::setUsuario);
                        }
                        inversionRepository.save(inversion);
                    } catch (Exception e) {
                        failed++;
                        errors.add("Inversion [" + dto.getSyncId() + "]: " + e.getMessage());
                    }
                }
            }

            // ── 7. Sincronizar Producción ──
            if (payload.getProduccion() != null) {
                for (ProduccionDTO dto : payload.getProduccion()) {
                    try {
                        Produccion produccion;
                        if (dto.getSyncId() != null && produccionRepository.existsBySyncId(dto.getSyncId())) {
                            produccion = produccionRepository.findBySyncId(dto.getSyncId()).get();
                            updated++;
                        } else {
                            produccion = new Produccion();
                            produccion.setSyncId(dto.getSyncId());
                            created++;
                        }
                        produccion.setActividad(dto.getActividad());
                        produccion.setUnidadMedida(dto.getUnidadMedida());
                        produccion.setCantidadProgramada(dto.getCantidadProgramada());
                        produccion.setCantidadEjecutada(dto.getCantidadEjecutada());
                        produccion.setRendimiento(dto.getRendimiento());
                        produccion.setObservaciones(dto.getObservaciones());

                        if (dto.getParteDiarioSyncId() != null) {
                            parteDiarioRepository.findBySyncId(dto.getParteDiarioSyncId())
                                    .ifPresent(produccion::setParteDiario);
                        }
                        if (dto.getPuntoMovilSyncId() != null) {
                            puntoMovilRepository.findBySyncId(dto.getPuntoMovilSyncId())
                                    .ifPresent(produccion::setPuntoMovil);
                        }
                        produccionRepository.save(produccion);
                    } catch (Exception e) {
                        failed++;
                        errors.add("Produccion [" + dto.getSyncId() + "]: " + e.getMessage());
                    }
                }
            }

            // ── 8. Sincronizar Equipos Maquinaria ──
            if (payload.getEquipos() != null) {
                for (EquipoMaquinariaDTO dto : payload.getEquipos()) {
                    try {
                        EquipoMaquinaria equipo;
                        if (dto.getSyncId() != null && equipoMaquinariaRepository.existsBySyncId(dto.getSyncId())) {
                            equipo = equipoMaquinariaRepository.findBySyncId(dto.getSyncId()).get();
                            updated++;
                        } else {
                            equipo = new EquipoMaquinaria();
                            equipo.setSyncId(dto.getSyncId());
                            created++;
                        }
                        equipo.setCodigo(dto.getCodigo());
                        equipo.setNombre(dto.getNombre());
                        equipo.setTipo(dto.getTipo());
                        equipo.setPlaca(dto.getPlaca());
                        equipo.setEstado(dto.getEstado());
                        equipo.setOperadorAsignado(dto.getOperadorAsignado());
                        equipo.setHorometroActual(dto.getHorometroActual());
                        equipoMaquinariaRepository.save(equipo);
                    } catch (Exception e) {
                        failed++;
                        errors.add("Equipo [" + dto.getSyncId() + "]: " + e.getMessage());
                    }
                }
            }

            // ── 9. Sincronizar Control Equipos ──
            if (payload.getControlEquipos() != null) {
                for (ControlEquipoDTO dto : payload.getControlEquipos()) {
                    try {
                        ControlEquipo control;
                        if (dto.getSyncId() != null && controlEquipoRepository.existsBySyncId(dto.getSyncId())) {
                            control = controlEquipoRepository.findBySyncId(dto.getSyncId()).get();
                            updated++;
                        } else {
                            control = new ControlEquipo();
                            control.setSyncId(dto.getSyncId());
                            created++;
                        }
                        control.setHorometroInicio(dto.getHorometroInicio());
                        control.setHorometroFin(dto.getHorometroFin());
                        control.setHorasTrabajadas(dto.getHorasTrabajadas());
                        control.setCombustibleConsumido(dto.getCombustibleConsumido());
                        control.setObservaciones(dto.getObservaciones());

                        if (dto.getEquipoSyncId() != null) {
                            equipoMaquinariaRepository.findBySyncId(dto.getEquipoSyncId())
                                    .ifPresent(control::setEquipo);
                        }
                        if (dto.getParteDiarioSyncId() != null) {
                            parteDiarioRepository.findBySyncId(dto.getParteDiarioSyncId())
                                    .ifPresent(control::setParteDiario);
                        }
                        controlEquipoRepository.save(control);
                    } catch (Exception e) {
                        failed++;
                        errors.add("ControlEquipo [" + dto.getSyncId() + "]: " + e.getMessage());
                    }
                }
            }

        } catch (Exception e) {
            log.error("Error general en sincronización", e);
            errors.add("Error general: " + e.getMessage());
        }

        // ── Registrar auditoría de sincronización ──
        SyncLog syncLog = new SyncLog();
        syncLog.setDispositivoId(payload.getDispositivoId());
        syncLog.setFechaSync(LocalDateTime.now());
        syncLog.setTipoSync("UPLOAD");
        syncLog.setTotalRegistros(created + updated + failed);
        syncLog.setRegistrosCreados(created);
        syncLog.setRegistrosActualizados(updated);
        syncLog.setRegistrosFallidos(failed);
        syncLog.setEstado(failed == 0 ? "EXITOSO" : (created + updated > 0 ? "PARCIAL" : "FALLIDO"));
        syncLog.setErrores(errors.isEmpty() ? null : String.join("; ", errors));
        syncLog.setPayloadResumen("Trabajadores: " +
                (payload.getTrabajadores() != null ? payload.getTrabajadores().size() : 0) +
                ", Partes: " +
                (payload.getPartesDiarios() != null ? payload.getPartesDiarios().size() : 0) +
                ", Inversiones: " +
                (payload.getInversiones() != null ? payload.getInversiones().size() : 0));
        syncLogRepository.save(syncLog);

        return SyncResultDTO.builder()
                .success(failed == 0)
                .message(failed == 0 ? "Sincronización exitosa" : "Sincronización con errores")
                .syncTimestamp(Instant.now())
                .totalRecordsProcessed(created + updated + failed)
                .recordsCreated(created)
                .recordsUpdated(updated)
                .recordsFailed(failed)
                .errors(errors)
                .build();
    }
}
