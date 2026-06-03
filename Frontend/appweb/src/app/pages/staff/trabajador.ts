import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Trabajador {

   // prueba
 jefesDeCampo = [
    {
      id: 'SUP-001',
      nombre: 'Brígida Torres',
      rol: 'Jefe de Campo / Cuadrilla A',
      zona: 'Lote 12 - Fundo Yaurilla',
      totalACargo: 10,
      avatar: 'BT',
      trabajadores: [
        { dni: '45678912', nombre: 'Juan Carlos Ramos', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 180.00, cajas: 5, metaBase: 10, rendimiento: 50, estado: 'Crítico', epps: 'Sí (Guantes, Tijera, Lentes)', restricciones: 'Ninguna' },
        { dni: '40897654', nombre: 'Carlos Mendoza Loza', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0.00, cajas: 9, metaBase: 10, rendimiento: 90, estado: 'Óptimo', epps: 'Sí (Guantes, Tijera, Lentes)', restricciones: 'Evitar cargas pesadas' },
        { dni: '44321678', nombre: 'Pedro Palacios Vega', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 45.00, cajas: 7.5, metaBase: 10, rendimiento: 75, estado: 'Regular', epps: 'Sí (Guantes, Tijera)', restricciones: 'Ninguna' },
        { dni: '41234567', nombre: 'Ana Gamarra Ruiz', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 210.00, cajas: 4, metaBase: 10, rendimiento: 40, estado: 'Crítico', epps: 'Sí (Guantes, Lentes)', restricciones: 'Ninguna' },
        { dni: '42345678', nombre: 'Luis Alberto Rojas', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0.00, cajas: 11, metaBase: 10, rendimiento: 110, estado: 'Óptimo', epps: 'Sí (Guantes, Tijera, Lentes)', restricciones: 'Ninguna' },
        { dni: '43456789', nombre: 'María Elena Flores', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 20.00, cajas: 8, metaBase: 10, rendimiento: 80, estado: 'Regular', epps: 'Sí (Guantes, Lentes)', restricciones: 'Ninguna' },
        { dni: '45567890', nombre: 'Jorge Díaz Hurtado', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 195.00, cajas: 4.8, metaBase: 10, rendimiento: 48, estado: 'Crítico', epps: 'Sí (Guantes, Tijera)', restricciones: 'Problemas lumbares' },
        { dni: '46678901', nombre: 'Lucía Méndez Castro', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0.00, cajas: 9.5, metaBase: 10, rendimiento: 95, estado: 'Óptimo', epps: 'Sí (Guantes, Tijera, Lentes)', restricciones: 'Ninguna' },
        { dni: '47789012', nombre: 'Raúl Espino Soto', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 35.00, cajas: 7.8, metaBase: 10, rendimiento: 78, estado: 'Regular', epps: 'Sí (Guantes, Lentes)', restricciones: 'Ninguna' },
        { dni: '48890123', nombre: 'Sofia Vargas Luna', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0.00, cajas: 10, metaBase: 10, rendimiento: 100, estado: 'Óptimo', epps: 'Sí (Guantes, Tijera, Lentes)', restricciones: 'Ninguna' }
      ]
    },
    {
      id: 'SUP-002',
      nombre: 'Elias Navarro',
      rol: 'Jefe de Campo / Cuadrilla B',
      zona: 'Lote 08 - Fundo Yaurilla',
      totalACargo: 10,
      avatar: 'RR',
      trabajadores: [
        { dni: '10234567', nombre: 'Mateo Quispe Huamán', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0.00, cajas: 12, metaBase: 10, rendimiento: 120, estado: 'Óptimo', epps: 'Sí (Tijera larga, Guantes)', restricciones: 'Ninguna' },
        { dni: '11345678', nombre: 'Diana Peralta Solis', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 150.00, cajas: 5.5, metaBase: 10, rendimiento: 55, estado: 'Crítico', epps: 'Sí (Tijera larga, Guantes)', restricciones: 'Hipertensión' },
        { dni: '12456789', nombre: 'Andrés Gutiérrez Paz', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 50.00, cajas: 7.2, metaBase: 10, rendimiento: 72, estado: 'Regular', epps: 'Sí (Guantes)', restricciones: 'Ninguna' },
        { dni: '13567890', nombre: 'Carmen Tello Rivas', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0.00, cajas: 9.2, metaBase: 10, rendimiento: 92, estado: 'Óptimo', epps: 'Sí (Tijera larga, Guantes)', restricciones: 'Ninguna' },
        { dni: '14678901', nombre: 'Manuel Benavides C.', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 160.00, cajas: 5.2, metaBase: 10, rendimiento: 52, estado: 'Crítico', epps: 'Sí (Guantes)', restricciones: 'Ninguna' },
        { dni: '15789012', nombre: 'Rosa Angulo Farfán', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 40.00, cajas: 7.6, metaBase: 10, rendimiento: 76, estado: 'Regular', epps: 'Sí (Tijera larga, Guantes)', restricciones: 'Ninguna' },
        { dni: '16890123', nombre: 'Félix Marín Cordero', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0.00, cajas: 9.8, metaBase: 10, rendimiento: 98, estado: 'Óptimo', epps: 'Sí (Tijera larga, Guantes)', restricciones: 'Ninguna' },
        { dni: '17901234', nombre: 'Elena Miranda Tueros', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 145.00, cajas: 5.8, metaBase: 10, rendimiento: 58, estado: 'Crítico', epps: 'Sí (Guantes)', restricciones: 'Ninguna' },
        { dni: '18012345', nombre: 'Hugo Salvatierra M.', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 30.00, cajas: 8.2, metaBase: 10, rendimiento: 82, estado: 'Regular', epps: 'Sí (Tijera larga, Guantes)', restricciones: 'Ninguna' },
        { dni: '19123456', nombre: 'Camila Falconi Vega', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0.00, cajas: 10.5, metaBase: 10, rendimiento: 105, estado: 'Óptimo', epps: 'Sí (Tijera larga, Guantes)', restricciones: 'Ninguna' }
      ]
    },
    {
      id: 'SUP-003',
      nombre: 'Jorge Ramírez',
      rol: 'Jefe de Campo / Cuadrilla C',
      zona: 'Lote 04 - Fundo Yaurilla',
      totalACargo: 10,
      avatar: 'ML',
      trabajadores: [
        { dni: '70123456', nombre: 'Ricardo Álvaro Solano', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 55.00, cajas: 7.0, metaBase: 10, rendimiento: 70, estado: 'Regular', epps: 'Sí (Tijeras Corvas, Guantes)', restricciones: 'Ninguna' },
        { dni: '71234567', nombre: 'Patricia Fuentes Ortiz', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0.00, cajas: 9.6, metaBase: 10, rendimiento: 96, estado: 'Óptimo', epps: 'Sí (Tijeras Corvas, Guantes)', restricciones: 'Ninguna' },
        { dni: '72345678', nombre: 'Gabriel Cáceres Leyva', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 175.00, cajas: 4.9, metaBase: 10, rendimiento: 49, estado: 'Crítico', epps: 'Sí (Guantes)', restricciones: 'Evaluación médica pendiente' },
        { dni: '73456789', nombre: 'Verónica Saavedra P.', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0.00, cajas: 10.2, metaBase: 10, rendimiento: 102, estado: 'Óptimo', epps: 'Sí (Tijeras Corvas, Guantes)', restricciones: 'Ninguna' },
        { dni: '74567890', nombre: 'Walter Yáñez Ramos', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 45.00, cajas: 7.4, metaBase: 10, rendimiento: 74, estado: 'Regular', epps: 'Sí (Guantes)', restricciones: 'Ninguna' },
        { dni: '75678901', nombre: 'Nancy Palomino Chu', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 185.00, cajas: 4.5, metaBase: 10, rendimiento: 45, estado: 'Crítico', epps: 'Sí (Tijeras Corvas, Guantes)', restricciones: 'Ninguna' },
        { dni: '76789012', nombre: 'Christian Neyra Torres', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0.00, cajas: 9.1, metaBase: 10, rendimiento: 91, estado: 'Óptimo', epps: 'Sí (Tijeras Corvas, Guantes)', restricciones: 'Ninguna' },
        { dni: '77890123', nombre: 'Sonia Alva Meléndez', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 35.00, cajas: 7.9, metaBase: 10, rendimiento: 79, estado: 'Regular', epps: 'Sí (Guantes)', restricciones: 'Ninguna' },
        { dni: '78901234', nombre: 'Tomas Bendezú Prado', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0.00, cajas: 11.2, metaBase: 10, rendimiento: 112, estado: 'Óptimo', epps: 'Sí (Tijeras Corvas, Guantes)', restricciones: 'Ninguna' },
        { dni: '79012345', nombre: 'Isabel Cárdenas Gil', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 200.00, cajas: 4.0, metaBase: 10, rendimiento: 40, estado: 'Crítico', epps: 'Sí (Guantes)', restricciones: 'Ninguna' }
      ]
    }
  ];

  constructor() { }

  // Retorna la lista de jefes completa
  getJefesDeCampo() {
    return this.jefesDeCampo;
  }

  // Busca un trabajador específico por su DNI a lo largo de todas las cuadrillas
  obtenerTrabajadorPorDni(dni: string) {
    for (let jefe of this.jefesDeCampo) {
      const encontrado = jefe.trabajadores.find(t => t.dni === dni);
      if (encontrado) return encontrado;
    }
    return null;
  }

  // Actualiza los datos modificados dentro de la lista centralizada
 actualizarTrabajador(trabajadorModificado: any): void {
  for (let jefe of this.jefesDeCampo) {
    const index = jefe.trabajadores.findIndex(t => t.dni === trabajadorModificado.dni);
    if (index !== -1) {
      // Reemplazamos el objeto con el mutado
      jefe.trabajadores[index] = { ...trabajadorModificado };
      
      // Forzamos romper la referencia del array de trabajadores para que Angular StaffPage se entere del cambio de inmediato
      jefe.trabajadores = [...jefe.trabajadores];
      
      console.log('Caché sincronizada y referencia refrescada para el DNI:', trabajadorModificado.dni);
      return;
    }
  }
}}