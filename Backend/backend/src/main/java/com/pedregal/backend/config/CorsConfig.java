package com.pedregal.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

/**
 * Configuración global de CORS.
 *
 * Permite que tanto la app web (Angular en localhost:4200)
 * como la app móvil (Ionic/Capacitor en capacitor://localhost o
 * http://localhost)
 * se conecten al backend sin bloqueos del navegador.
 *
 * ⚠️ En PRODUCCIÓN, reemplaza los orígenes con tus dominios reales.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // ── Orígenes permitidos ──
        config.setAllowedOrigins(List.of(
                "http://localhost:4200", // Angular dev server (web)
                "http://localhost:8100", // Ionic dev server (móvil en navegador)
                "capacitor://localhost", // Ionic Capacitor (Android/iOS nativo)
                "http://localhost", // Fallback genérico
                "https://localhost" // HTTPS local
        ));

        // ── Métodos HTTP permitidos ──
        config.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // ── Headers permitidos ──
        config.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With",
                "X-Device-Id"));

        // ── Headers expuestos al cliente ──
        config.setExposedHeaders(Arrays.asList(
                "Authorization",
                "X-Total-Count"));

        // ── Permitir cookies / credenciales ──
        config.setAllowCredentials(true);

        // ── Cache del preflight (en segundos) ──
        config.setMaxAge(3600L);

        // ── Aplicar a todas las rutas ──
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
