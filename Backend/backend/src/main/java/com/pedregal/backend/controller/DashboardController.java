package com.pedregal.backend.controller;

import com.pedregal.backend.dto.DashboardDTO;
import com.pedregal.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/resumen")
    public ResponseEntity<DashboardDTO> getResumen() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }
}