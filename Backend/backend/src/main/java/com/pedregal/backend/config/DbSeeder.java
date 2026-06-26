package com.pedregal.backend.config;

import com.pedregal.backend.entity.Trabajador;
import com.pedregal.backend.entity.Usuario;
import com.pedregal.backend.repository.TrabajadorRepository;
import com.pedregal.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import org.springframework.security.crypto.password.PasswordEncoder;

@Component
@RequiredArgsConstructor
public class DbSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final TrabajadorRepository trabajadorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("admin"));
            admin.setNombreCompleto("Administrador General");
            admin.setRol("ADMIN");
            admin.setEmail("admin@elpedregal.com");
            admin.setSyncId("USR-ADMIN");
            usuarioRepository.save(admin);

            Usuario jefe1 = new Usuario();
            jefe1.setUsername("brigida");
            jefe1.setPasswordHash(passwordEncoder.encode("brigida123"));
            jefe1.setNombreCompleto("Brígida Torres");
            jefe1.setRol("JEFE_CAMPO");
            jefe1.setSyncId("SUP-001");
            usuarioRepository.save(jefe1);

            Usuario jefe2 = new Usuario();
            jefe2.setUsername("elias");
            jefe2.setPasswordHash(passwordEncoder.encode("elias123"));
            jefe2.setNombreCompleto("Elias Navarro");
            jefe2.setRol("JEFE_CAMPO");
            jefe2.setSyncId("SUP-002");
            usuarioRepository.save(jefe2);

            System.out.println("✅ Usuarios semilla insertados.");
        }

        // Bloque de trabajadores deshabilitado por requerimiento de negocio:
        // La base de datos debe iniciar sin registros ficticios de personal operativo.
        /*
        if (trabajadorRepository.count() == 0) {
            String[] nombres = {
                "Juan Carlos Ramos", "Carlos Mendoza Loza", "Pedro Palacios Vega",
                "Ana Gamarra Ruiz", "Luis Alberto Rojas", "María Elena Flores",
                "Mateo Quispe Huamán", "Diana Peralta Solis", "Andrés Gutiérrez Paz"
            };

            for (int i = 0; i < nombres.length; i++) {
                Trabajador t = new Trabajador();
                t.setDni("4000000" + i);
                t.setNombre(nombres[i].split(" ")[0]);
                t.setApellido(nombres[i].substring(nombres[i].indexOf(" ") + 1));
                t.setCargo("Cosechador");
                t.setAreaTrabajo("Lote General");
                t.setSalarioDiario(40.0);
                t.setSyncId("TRB-" + t.getDni());
                trabajadorRepository.save(t);
            }
            System.out.println("✅ Trabajadores semilla insertados.");
        }
        */
    }
}