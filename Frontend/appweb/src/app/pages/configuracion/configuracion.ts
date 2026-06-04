import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion implements OnInit {

 fundos: any[] = [
    { nombre: 'Fundo San José',   ubicacion: 'Ica, Perú',   hectareas: 450 },
    { nombre: 'Fundo Santa Rosa', ubicacion: 'Piura, Perú', hectareas: 320 },
  ];

  mostrarModalFundo = false;
  mensajeFundo = '';
  nuevoFundo = { nombre: '', ubicacion: '', hectareas: null };

  abrirModalFundo() { this.mostrarModalFundo = true; this.mensajeFundo = ''; }
  cerrarModalFundo() { this.mostrarModalFundo = false; this.nuevoFundo = { nombre: '', ubicacion: '', hectareas: null }; }

  agregarFundo() {
    if (!this.nuevoFundo.nombre || !this.nuevoFundo.ubicacion || !this.nuevoFundo.hectareas) {
      this.mensajeFundo = '⚠️ Complete todos los campos obligatorios.';
      return;
    }
    this.fundos.push({ ...this.nuevoFundo });
    this.cerrarModalFundo();
  }

  eliminarFundo(i: number) {
    this.fundos.splice(i, 1);
  }

  // ═══ CULTIVOS ═══════════════════════════════════════════
  cultivos: any[] = [
    { nombre: 'Uva de Mesa', variedades: 8, color: '#27ae60' },
    { nombre: 'Arándanos',   variedades: 4, color: '#8e44ad' },
    { nombre: 'Palto Has',   variedades: 2, color: '#e67e22' },
  ];

  mostrarModalCultivo = false;
  mensajeCultivo = '';
  nuevoCultivo = { nombre: '', variedades: null, color: '#27ae60' };

  abrirModalCultivo() { this.mostrarModalCultivo = true; this.mensajeCultivo = ''; }
  cerrarModalCultivo() { this.mostrarModalCultivo = false; this.nuevoCultivo = { nombre: '', variedades: null, color: '#27ae60' }; }

  agregarCultivo() {
    if (!this.nuevoCultivo.nombre || !this.nuevoCultivo.variedades) {
      this.mensajeCultivo = '⚠️ Complete todos los campos obligatorios.';
      return;
    }
    this.cultivos.push({ ...this.nuevoCultivo });
    this.cerrarModalCultivo();
  }

  eliminarCultivo(i: number) {
    this.cultivos.splice(i, 1);
  }

  // ═══ USUARIOS ═══════════════════════════════════════════
  usuarios: any[] = [
    { nombre: 'Miguel Arrieta',  email: 'm.arrieta@pedregal.com',  rol: 'Administrador', estado: true },
    { nombre: 'Sofia Valdivia',  email: 's.valdivia@pedregal.com', rol: 'Supervisor',    estado: true },
    { nombre: 'Luis Campos',     email: 'l.campos@pedregal.com',   rol: 'Supervisor',    estado: false },
  ];

  nuevoUsuario = { nombre: '', email: '', rol: 'Supervisor' };
  mensajeUsuario = '';

  get totalAdmins() { return this.usuarios.filter(u => u.rol === 'Administrador').length; }
  get totalStaff()  { return this.usuarios.filter(u => u.rol !== 'Administrador').length; }

  getIniciales(nombre: string): string {
    if (!nombre) return '?';
    return nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  crearUsuario() {
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.email) {
      this.mensajeUsuario = '⚠️ Nombre y correo son obligatorios.';
      return;
    }
    this.usuarios.push({ ...this.nuevoUsuario, estado: true });
    this.nuevoUsuario = { nombre: '', email: '', rol: 'Supervisor' };
    this.mensajeUsuario = '✅ Usuario creado correctamente.';
    setTimeout(() => this.mensajeUsuario = '', 3000);
  }

  toggleEstadoUsuario(usuario: any) {
    usuario.estado = !usuario.estado;
  }

  eliminarUsuario(i: number) {
    this.usuarios.splice(i, 1);
  }

  // ═══ LOTES ══════════════════════════════════════════════
  fundoSeleccionado    = 'Fundo San José';
  mostrarDropdownFundo = false;
  loteSeleccionado: any = null;
  lotesSeleccionados: any[] = [];
  capacidadTotal = 84;

  lotesDelFundo: any[] = [
    { nombre: 'Lote A1', hectareas: 12.5, cultivo: 'Uva de Mesa', estado: 'Activo',   x: 22, y: 28, seleccionado: false },
    { nombre: 'Lote A2', hectareas: 8.3,  cultivo: 'Espárrago',   estado: 'Activo',   x: 47, y: 40, seleccionado: false },
    { nombre: 'Lote B1', hectareas: 15.0, cultivo: 'Uva de Mesa', estado: 'Inactivo', x: 67, y: 58, seleccionado: false },
    { nombre: 'Lote B2', hectareas: 6.7,  cultivo: 'Palta',       estado: 'Activo',   x: 32, y: 70, seleccionado: false },
  ];

  toggleDropdownFundo() {
    this.mostrarDropdownFundo = !this.mostrarDropdownFundo;
  }

  seleccionarFundo(nombre: string) {
    this.fundoSeleccionado    = nombre;
    this.mostrarDropdownFundo = false;
    this.loteSeleccionado     = null;
    this.lotesSeleccionados   = [];
    this.lotesDelFundo.forEach(l => l.seleccionado = false);
  }

  seleccionarLote(lote: any) {
    this.lotesDelFundo.forEach(l => l.seleccionado = false);
    lote.seleccionado      = true;
    this.loteSeleccionado  = lote;
    this.lotesSeleccionados = this.lotesDelFundo.filter(l => l.seleccionado);
  }

  editarLote() {
    alert(`Editando: ${this.loteSeleccionado?.nombre}`);
  }

  eliminarLote() {
    if (!this.loteSeleccionado) return;
    this.lotesDelFundo    = this.lotesDelFundo.filter(l => l !== this.loteSeleccionado);
    this.loteSeleccionado = null;
    this.lotesSeleccionados = [];
  }

  ngOnInit() {}
}