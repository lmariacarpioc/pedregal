package com.pedregal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private String syncId;
    private String username;
    private String passwordHash;
    private String nombreCompleto;
    private String rol; // ADMIN, JEFE_CAMPO, SUPERVISOR, ASISTENTE
    private String email;
    private Long jefeId;
    private String jefeSyncId;
    private boolean activo;
}
