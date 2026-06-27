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
    telefono: '', 
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

  async guardarCambios(): Promise<void> {
    if (!this.validarFormulario()) {
      this.formularioInvalido = true;
      alert('Faltan campos obligatorios. Por favor, complete todos los campos requeridos.');
      return;
    }
    
    if (this.esModoCreacion) {
      const nuevoTrabajador = {
        ...this.trabajadorEdicion,
        id: undefined,
        syncId: `TRB-${this.trabajadorEdicion.dni}`
      };
      
      await this.trabajador.agregarTrabajadorAJefe(this.trabajadorEdicion.jefeSyncId || '', nuevoTrabajador);
    } else {
      await this.trabajador.actualizarTrabajador(this.trabajadorEdicion);
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
      const partesDelTrabajador = partes.filter(p => p.personal.some((per: any) => per.dni === this.trabajadorEdicion.dni));
      if (partesDelTrabajador.length > 0) {
        const parte = partesDelTrabajador[partesDelTrabajador.length - 1];
        const date = new Date(parte.fecha + 'T00:00:00');
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
      }
    }
    return 'Sin evaluaciones recientes';
  }
}