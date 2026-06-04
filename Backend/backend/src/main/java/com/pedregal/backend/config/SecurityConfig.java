package com.pedregal.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuración de Spring Security.
 *
 * Por ahora deshabilitamos CSRF (la app móvil no usa cookies/sesiones,
 * envía tokens en el header) y permitimos todos los endpoints de la API.
 *
 * ⚠️ En PRODUCCIÓN, protege los endpoints con JWT o similar.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Deshabilitar CSRF (la API es stateless, usa JSON)
                .csrf(AbstractHttpConfigurer::disable)

                // No crear sesiones HTTP (API REST stateless)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Permitir CORS (delegamos a CorsConfig.java)
                .cors(cors -> {
                })

                // Autorización de endpoints
                .authorizeHttpRequests(auth -> auth
                        // Permitir todos los endpoints de la API (en desarrollo)
                        .requestMatchers("/api/**").permitAll()
                        // Cualquier otra ruta también permitida (por ahora)
                        .anyRequest().permitAll());

        return http.build();
    }
}
