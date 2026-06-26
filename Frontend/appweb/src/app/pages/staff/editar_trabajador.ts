import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Trabajador } from './trabajador';


@Component({
  selector: 'app-editar-trabajador',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './editar_trabajador.html',
  styleUrl: './editar_trabajador.css'
})
export class EditarTrabajador implements OnInit {
  dniTrabajador: string | null = null;
  trabajadorEdicion: any = {
    nombre: '',
    dni: '',
    fechaNacimiento: '',
    genero: 'Masculino',
    grupoSanguineo: 'A+',
    alergias: 'Ninguna reportada',
    restricciones: 'Ninguna',
    lote: 'Lote 12 - Fundo Yaurilla',
    jefeSyncId: '',
    labor: 'Cosecha de Uva',
    horasLaboradas: 8,
    fechaIngreso: '',
    activo: true
  };
  jefes: any[] = [];
  esModoCreacion = false;
  formularioInvalido = false;

  constructor(private route: ActivatedRoute, private router: Router, private trabajador: Trabajador) {}

  ngOnInit(): void {
    this.jefes = this.trabajador.getJefesDeCampo();
    this.dniTrabajador = this.route.snapshot.paramMap.get('dni');
    if (this.dniTrabajador) {
      this.esModoCreacion = false;
      this.buscarTrabajador(this.dniTrabajador);
    } else {
      this.esModoCreacion = true;
      this.trabajadorEdicion.fechaIngreso = new Date().toISOString().split('T')[0];
    }
  }

  buscarTrabajador(dni: string): void {
    const encontrado = this.trabajador.obtenerTrabajadorPorDni(dni);
    if (encontrado) {
      this.trabajadorEdicion = { ...encontrado };
    } else {
      this.regresarAStaff();
    }
  }
  
  validarFormulario(): boolean {
    const t = this.trabajadorEdicion;
    return !!(t.nombre && t.dni && t.fechaNacimiento && t.genero && t.grupoSanguineo && t.lote && t.labor && t.fechaIngreso && t.jefeSyncId);
  }

  guardarCambios(): void {
    if (!this.validarFormulario()) {
      this.formularioInvalido = true;
      alert('Faltan campos obligatorios. Por favor, complete todos los campos requeridos (marcados en rojo si se omiten).');
      return;
    }
    
    if (this.esModoCreacion) {
      // Create new worker logic
      const nuevoTrabajador = {
        ...this.trabajadorEdicion,
        id: `TRAB-${Date.now()}`,
        syncId: `TRAB-${Date.now()}`
      };
      
      // Update the specific manager if selected
      if (this.trabajadorEdicion.jefeSyncId) {
        this.trabajador.agregarTrabajadorAJefe(this.trabajadorEdicion.jefeSyncId, nuevoTrabajador);
      } else {
        // If no jefeSyncId, we still need to create it (though UI requires it)
        this.trabajador.agregarTrabajadorAJefe('', nuevoTrabajador);
      }
    } else {
      this.trabajador.actualizarTrabajador(this.trabajadorEdicion);
    }
    this.regresarAStaff();
  }

  regresarAStaff(): void {
    this.router.navigate(['/staff']);
  }

  get ultimaEvaluacion(): string {
    if (this.esModoCreacion) return 'Recientemente';
    const partes = this.trabajador.getPartesFinalizados();
    if (partes.length > 0) {
      // Tomamos la fecha del último parte donde este trabajador participó
      const partesDelTrabajador = partes.filter(p => p.personal.some((per: any) => per.dni === this.trabajadorEdicion.dni));
      if (partesDelTrabajador.length > 0) {
        const parte = partesDelTrabajador[partesDelTrabajador.length - 1];
        const date = new Date(parte.fecha + 'T00:00:00'); // Ensure local timezone parsing correctly
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
      }
    }
    return 'Sin evaluaciones recientes';
  }
}
