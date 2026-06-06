package com.pedregal.backend.controller;

import com.pedregal.backend.dto.SyncPayloadDTO;
import com.pedregal.backend.dto.SyncResultDTO;
import com.pedregal.backend.service.SyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sync")
@RequiredArgsConstructor
public class SyncController {

    private final SyncService syncService;

    @PostMapping("/upload")
    public ResponseEntity<SyncResultDTO> syncData(@RequestBody SyncPayloadDTO payload) {
        SyncResultDTO result = syncService.processSync(payload);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/download")
    public ResponseEntity<SyncPayloadDTO> downloadSync(@RequestParam(required = false, defaultValue = "web") String dispositivoId) {
        return ResponseEntity.ok(syncService.downloadSync(dispositivoId));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSyncStatus() {
        return ResponseEntity.ok(Map.of(
                "status", "online",
                "timestamp", java.time.Instant.now()
        ));
    }
}