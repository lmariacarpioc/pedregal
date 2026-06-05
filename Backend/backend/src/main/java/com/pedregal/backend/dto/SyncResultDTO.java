package com.pedregal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncResultDTO {
    private boolean success;
    private String message;
    private Instant syncTimestamp;
    private int totalRecordsProcessed;
    private int recordsCreated;
    private int recordsUpdated;
    private int recordsFailed;
    private List<String> errors;
}
