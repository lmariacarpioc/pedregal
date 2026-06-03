import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Trabajador } from './trabajador';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './staff.page.html',
  styleUrl: './staff.page.css',
})
export class StaffPage implements OnInit {
  
  supervisorSeleccionado: string | null = 'SUP-001';
  trabajadorDetalle: any | null = null;
  menuActivoId: string | null = null;
textoBusqueda: string = '';
  
jefesDeCampo: any[] = [];

  constructor(private router: Router,private trabajador: Trabajador) { }

  ngOnInit(): void {
  // Al regresar de la navegación, extraemos la lista fresca desde la simulación del servicio
  this.jefesDeCampo = this.trabajador.getJefesDeCampo();
  
  // Opcional: Si quieres expandir automáticamente el supervisor seleccionado por defecto
  // para auditar el cambio rápido:
  this.supervisorSeleccionado = 'SUP-001'; 
}
  get jefesFiltrados() {
    if (!this.textoBusqueda || this.textoBusqueda.trim() === '') {
      return this.jefesDeCampo;
    }
    
    const busqueda = this.textoBusqueda.toLowerCase().trim();
    
    return this.jefesDeCampo.filter(jefe => 
      jefe.nombre.toLowerCase().includes(busqueda) || 
      jefe.zona.toLowerCase().includes(busqueda)
    );}

  seleccionarSupervisor(id: string): void {
    if (this.supervisorSeleccionado === id) {
      this.supervisorSeleccionado = null;
    } else {
      this.supervisorSeleccionado = id;
    }
    this.menuActivoId = null; // Cierra menús abiertos al cambiar de supervisor
  }

  toggleMenuAcciones(dni: string, event: Event): void {
    event.stopPropagation(); // Evita clics indeseados en la fila
    this.menuActivoId = this.menuActivoId === dni ? null : dni;
  }

  verDetalleTrabajador(trabajador: any, event: Event): void {
    event.stopPropagation();
    this.trabajadorDetalle = trabajador;
    this.menuActivoId = null; // Cierra el menú al abrir el panel
  }

  cerrarDetalle(): void {
    this.trabajadorDetalle = null;
  }
  irAEditarTrabajador(dni: string, event: Event): void {
    event.stopPropagation(); // Detiene que el acordeón de fondo se mueva
    console.log('Navegando al perfil del trabajador con DNI:', dni);
    
    this.router.navigate(['/staff/editar_trabajador', dni]);
  }}