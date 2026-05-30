import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './staff.page.html',
  styleUrl: './staff.page.css',
})
export class StaffPage {
  
  // Almacena cuál supervisor está expandido actualmente (null significa ninguno)
  supervisorSeleccionado: string | null = 'SUP-001';

  // Control del panel lateral de detalle del trabajador
  trabajadorDetalle: any | null = null;

 // Datos limpios y estructurados tal cual se sincronizan desde la app móvil
  jefesDeCampo = [
    {
      id: 'SUP-001',
      nombre: 'Brígida Torres',
      rol: 'Jefe de Campo / Cuadrilla A',
      zona: 'Lote 12 - Fundo Ica',
      totalACargo: 3,
      avatar: 'BT',
      trabajadores: [
        { 
          dni: '45678912', 
          nombre: 'Juan Carlos Ramos',  
          labor: 'Cosecha de Uva', 
          lote: 'Lote 12 - Fundo Ica',
          horasLaboradas: 8,
          costoTraducido: 180.00,
          unidadesHora: 5, 
          metaBase: 10,
          rendimiento: 50, 
          estado: 'Crítico',
          epps: 'Sí (Guantes, Tijera, Lentes)',
          restricciones: 'Ninguna'
        },
        { 
           dni: '40897654', 
          nombre: 'Carlos Mendoza Loza', 
         
          labor: 'Cosecha de Uva', 
          lote: 'Lote 12 - Fundo Ica',
          horasLaboradas: 8,
          costoTraducido: 0.00,
          unidadesHora: 9, 
          metaBase: 10,
          rendimiento: 90, 
          estado: 'Óptimo',
          epps: 'Sí (Guantes, Tijera, Lentes)',
          restricciones: 'Evitar cargas pesadas'
        },
        { 
          dni: '44321678', 
          nombre: 'Pedro Palacios Vega', 
          
          labor: 'Cosecha de Uva', 
          lote: 'Lote 12 - Fundo Ica',
          horasLaboradas: 8,
          costoTraducido: 45.00,
          unidadesHora: 7.5, 
          metaBase: 10,
          rendimiento: 75, 
          estado: 'Regular',
          epps: 'Sí (Guantes, Tijera)',
          restricciones: 'Ninguna'
        }
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void { }

  // Función que alterna la apertura del desglose al hacer clic
  seleccionarSupervisor(id: string): void {
    if (this.supervisorSeleccionado === id) {
      this.supervisorSeleccionado = null; // Si vuelve a hacer clic en el mismo, se cierra
    } else {
      this.supervisorSeleccionado = id; // Abre el nuevo
    }
  }

  // Abre el detalle lateral al hacer clic en el trabajador
  verDetalleTrabajador(trabajador: any, event: Event): void {
    event.stopPropagation(); // Evita conflictos con el clic del acordeón
    this.trabajadorDetalle = trabajador;
  }

  // Cierra el panel de detalle lateral
  cerrarDetalle(): void {
    this.trabajadorDetalle = null;
  }

}
