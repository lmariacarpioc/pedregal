package com.pedregal.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SyncResultResponse {

    private int totalRecibidos;

    private int nuevosGuardados;

    private int duplicadosIgnorados;

    private int errores;

    private List<String> idsNuevos;

    private List<String> idsDuplicados;

    private List<String> detallesErrores;

    private LocalDateTime timestampServidor;
}