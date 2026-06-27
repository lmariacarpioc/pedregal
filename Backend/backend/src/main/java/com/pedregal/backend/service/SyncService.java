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

    private final ReporteRepository reporteRepository;
    private final InversionRepository inversionRepository;
    private final ProduccionRepository produccionRepository;
    private final SyncLogRepository syncLogRepository;

    // @Transactional (Removido para evitar rollback global que impida procesar otras entidades tras un fallo)
    public SyncResultDTO processSync(SyncPayloadDTO payload) {
        List<String> errors = new ArrayList<>();
        int created = 0, updated = 0, failed = 0;
        
        // 1. Guardar SyncLog al inicio
        SyncLog syncLog = new SyncLog();
        syncLog.setDispositivoId(payload.getDispositivoId());
        syncLog.setFechaSync(LocalDateTime.now());
        syncLog.setTipoSync("UPLOAD");
        syncLog.setEstado("PROCESANDO");
        syncLog.setPayloadResumen("Trabajadores: " +
                (payload.getTrabajadores() != null ? payload.getTrabajadores().size() : 0) +
                ", Partes: " +
                (payload.getPartesDiarios() != null ? payload.getPartesDiarios().size() : 0) +
                ", Inversiones: " +
                (payload.getInversiones() != null ? payload.getInversiones().size() : 0));
        syncLog = syncLogRepository.save(syncLog);

        try {

            if (payload.getTrabajadores() != null) {
                for (TrabajadorDTO dto : payload.getTrabajadores()) {
                    if (dto == null) continue;
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
                            if (dto.getJefeSyncId() != null) {
                                usuarioRepository.findBySyncId(dto.getJefeSyncId()).ifPresent(existing::setJefe);
                            } else {
                                existing.setJefe(null);
                            }
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
                            if (dto.getJefeSyncId() != null) {
                                usuarioRepository.findBySyncId(dto.getJefeSyncId()).ifPresent(nuevo::setJefe);
                            }
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


            if (payload.getPartesDiarios() != null) {
                for (ParteDiarioDTO dto : payload.getPartesDiarios()) {
                    if (dto == null) continue;
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

                        if (dto.getUsuarioSyncId() != null) {
                            usuarioRepository.findBySyncId(dto.getUsuarioSyncId())
                                    .ifPresent(parte::setUsuario);
                        }
                        parte = parteDiarioRepository.save(parte);

                        if (dto.getDetalles() != null) {
                            for (ParteDiarioDetalleDTO detDto : dto.getDetalles()) {
                                if (detDto == null) continue;
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
                                    detalle.setCantidad(detDto.getCantidad());
                                    detalle.setTipoActividad(detDto.getTipoActividad());

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


            if (payload.getReportes() != null) {
                for (ReporteDTO dto : payload.getReportes()) {
                    if (dto == null) continue;
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

            if (payload.getInversiones() != null) {
                for (InversionDTO dto : payload.getInversiones()) {
                    if (dto == null) continue;
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

            if (payload.getProduccion() != null) {
                for (ProduccionDTO dto : payload.getProduccion()) {
                    if (dto == null) continue;
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

                        produccionRepository.save(produccion);
                    } catch (Exception e) {
                        failed++;
                        errors.add("Produccion [" + dto.getSyncId() + "]: " + e.getMessage());
                    }
                }
            }


        } catch (Exception e) {
            log.error("Error general en sincronización", e);
            errors.add("Error general: " + e.getMessage());
        }

        // 3. Actualizar SyncLog al final
        syncLog.setTotalRegistros(created + updated + failed);
        syncLog.setRegistrosCreados(created);
        syncLog.setRegistrosActualizados(updated);
        syncLog.setRegistrosFallidos(failed);
        syncLog.setEstado(failed == 0 ? "EXITOSO" : (created + updated > 0 ? "PARCIAL" : "FALLIDO"));
        syncLog.setErrores(errors.isEmpty() ? null : String.join("; ", errors));
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

    @Transactional(readOnly = true)
    public SyncPayloadDTO downloadSync(String dispositivoId) {
        SyncPayloadDTO payload = new SyncPayloadDTO();
        payload.setDispositivoId(dispositivoId);
        payload.setTimestamp(Instant.now().toString());

        List<UsuarioDTO> usuarios = usuarioRepository.findAll().stream().map(u -> {
            UsuarioDTO dto = new UsuarioDTO();
            dto.setSyncId(u.getSyncId());
            dto.setUsername(u.getUsername());
            dto.setNombreCompleto(u.getNombreCompleto());
            dto.setRol(u.getRol());
            dto.setEmail(u.getEmail());
            dto.setActivo(u.isActivo());
            if (u.getJefe() != null) {
                dto.setJefeId(u.getJefe().getId());
                dto.setJefeSyncId(u.getJefe().getSyncId());
            }
            return dto;
        }).toList();
        payload.setUsuarios(usuarios);

        List<Trabajador> trabajadoresFiltrados;
        Usuario dispositivoJefe = usuarioRepository.findBySyncId(dispositivoId).orElse(null);
        if (dispositivoJefe != null && "JEFE_CAMPO".equals(dispositivoJefe.getRol())) {
            trabajadoresFiltrados = trabajadorRepository.findByJefe_Id(dispositivoJefe.getId());
        } else {
            trabajadoresFiltrados = trabajadorRepository.findAll();
        }

        List<TrabajadorDTO> trabajadores = trabajadoresFiltrados.stream().map(t -> {
            TrabajadorDTO dto = new TrabajadorDTO();
            dto.setId(t.getId());
            dto.setSyncId(t.getSyncId());
            dto.setNombre(t.getNombre());
            dto.setApellido(t.getApellido());
            dto.setDni(t.getDni());
            dto.setCargo(t.getCargo());
            dto.setAreaTrabajo(t.getAreaTrabajo());
            dto.setTelefono(t.getTelefono());
            dto.setCategoria(t.getCategoria());
            dto.setSalarioDiario(t.getSalarioDiario());
            dto.setActivo(t.isActivo());
            if (t.getJefe() != null) {
                dto.setJefeId(t.getJefe().getId());
                dto.setJefeSyncId(t.getJefe().getSyncId());
            }
            return dto;
        }).toList();
        payload.setTrabajadores(trabajadores);

        List<ParteDiarioDTO> partesDiarios = parteDiarioRepository.findAll().stream().map(p -> {
            ParteDiarioDTO dto = new ParteDiarioDTO();
            dto.setSyncId(p.getSyncId());
            dto.setFecha(p.getFecha().toString());
            dto.setTurno(p.getTurno());
            dto.setClima(p.getClima());
            dto.setEstado(p.getEstado());
            if (p.getUsuario() != null) dto.setUsuarioSyncId(p.getUsuario().getSyncId());

            List<ParteDiarioDetalleDTO> detalles = parteDiarioDetalleRepository.findByParteDiarioId(p.getId()).stream().map(d -> {
                ParteDiarioDetalleDTO detDto = new ParteDiarioDetalleDTO();
                detDto.setSyncId(d.getSyncId());
                if (d.getTrabajador() != null) detDto.setTrabajadorSyncId(d.getTrabajador().getSyncId());
                detDto.setHoraEntrada(d.getHoraEntrada());
                detDto.setHoraSalida(d.getHoraSalida());
                detDto.setEstadoAsistencia(d.getEstadoAsistencia());
                detDto.setCantidad(d.getCantidad());
                detDto.setTipoActividad(d.getTipoActividad());
                return detDto;
            }).toList();
            dto.setDetalles(detalles);
            return dto;
        }).toList();
        payload.setPartesDiarios(partesDiarios);


        List<ReporteDTO> reportes = reporteRepository.findAll().stream().map(r -> {
            ReporteDTO dto = new ReporteDTO();
            dto.setSyncId(r.getSyncId());
            dto.setTitulo(r.getTitulo());
            dto.setTipoReporte(r.getTipoReporte());
            dto.setFechaInicio(r.getFechaInicio() != null ? r.getFechaInicio().toString() : null);
            dto.setFechaFin(r.getFechaFin() != null ? r.getFechaFin().toString() : null);
            dto.setContenido(r.getContenido());
            dto.setConclusiones(r.getConclusiones());
            dto.setEstado(r.getEstado());
            if (r.getUsuario() != null) dto.setUsuarioSyncId(r.getUsuario().getSyncId());
            return dto;
        }).toList();
        payload.setReportes(reportes);

        List<InversionDTO> inversiones = inversionRepository.findAll().stream().map(inv -> {
            InversionDTO dto = new InversionDTO();
            dto.setSyncId(inv.getSyncId());
            dto.setConcepto(inv.getConcepto());
            dto.setCategoria(inv.getCategoria());
            dto.setMonto(inv.getMonto());
            dto.setFechaGasto(inv.getFechaGasto() != null ? inv.getFechaGasto().toString() : null);
            dto.setProveedor(inv.getProveedor());
            dto.setNumeroFactura(inv.getNumeroFactura());
            dto.setDescripcion(inv.getDescripcion());
            dto.setEstado(inv.getEstado());
            if (inv.getUsuario() != null) dto.setUsuarioSyncId(inv.getUsuario().getSyncId());
            return dto;
        }).toList();
        payload.setInversiones(inversiones);

        List<ProduccionDTO> produccion = produccionRepository.findAll().stream().map(prod -> {
            ProduccionDTO dto = new ProduccionDTO();
            dto.setSyncId(prod.getSyncId());
            dto.setActividad(prod.getActividad());
            dto.setUnidadMedida(prod.getUnidadMedida());
            dto.setCantidadProgramada(prod.getCantidadProgramada());
            dto.setCantidadEjecutada(prod.getCantidadEjecutada());
            dto.setRendimiento(prod.getRendimiento());
            dto.setObservaciones(prod.getObservaciones());
            if (prod.getParteDiario() != null) dto.setParteDiarioSyncId(prod.getParteDiario().getSyncId());

            return dto;
        }).toList();
        payload.setProduccion(produccion);

        return payload;
    }
}