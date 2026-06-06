package com.pedregal.backend.service;

import com.pedregal.backend.dto.DashboardDTO;
import com.pedregal.backend.repository.InversionRepository;
import com.pedregal.backend.repository.ParteDiarioRepository;
import com.pedregal.backend.repository.ProduccionRepository;
import com.pedregal.backend.repository.TrabajadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TrabajadorRepository trabajadorRepository;
    private final ParteDiarioRepository parteDiarioRepository;
    private final InversionRepository inversionRepository;
    private final ProduccionRepository produccionRepository;

    public DashboardDTO getDashboardData() {
        LocalDate hoy = LocalDate.now();

        return DashboardDTO.builder()
                .totalTrabajadores(trabajadorRepository.findByActivoTrue().size())
                .partesDiariosHoy(parteDiarioRepository.countByFecha(hoy))
                .produccionSemanal(0)
                .inversionMensual(0)
                .build();
    }
}