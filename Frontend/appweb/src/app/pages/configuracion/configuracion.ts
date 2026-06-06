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

  // ═══ FUNDOS ═══════════════════════════════════════════════
  fundos: any[] = [
    { nombre: 'Fundo San José',    ubicacion: 'Ica, Perú',    hectareas: 450 },
    { nombre: 'Fundo Santa Rosa',  ubicacion: 'Piura, Perú',  hectareas: 320 },
    { nombre: 'Fundo Yaurilla',    ubicacion: 'Trujillo, Perú', hectareas: 280 },
  ];

  mostrarModalFundo = false;
  mensajeFundo      = '';
  nuevoFundo        = { nombre: '', ubicacion: '', hectareas: null as any };

  abrirModalFundo()  { this.mostrarModalFundo = true;  this.mensajeFundo = ''; }
  cerrarModalFundo() { this.mostrarModalFundo = false; this.nuevoFundo = { nombre: '', ubicacion: '', hectareas: null }; }

  agregarFundo() {
    if (!this.nuevoFundo.nombre.trim() || !this.nuevoFundo.ubicacion.trim() || !this.nuevoFundo.hectareas) {
      this.mensajeFundo = 'Complete todos los campos obligatorios.';
      return;
    }
    this.fundos.push({ ...this.nuevoFundo });
    // Si es el primer fundo, seleccionarlo automáticamente
    if (this.fundos.length === 1) this.fundoSeleccionado = this.fundos[0].nombre;
    this.cerrarModalFundo();
  }

  eliminarFundo(i: number) {
    const nombre = this.fundos[i].nombre;
    this.fundos.splice(i, 1);
    if (this.fundoSeleccionado === nombre) {
      this.fundoSeleccionado = this.fundos[0]?.nombre ?? '';
    }
  }

  // ═══ CULTIVOS ══════════════════════════════════════════════
  cultivos: any[] = [
    { nombre: 'Uva de Mesa',  variedades: 8, color: '#38a169' },
    { nombre: 'Arándanos',    variedades: 4, color: '#805ad5' },
    { nombre: 'Palto Has',    variedades: 2, color: '#dd6b20' },
    { nombre: 'Espárrago',    variedades: 3, color: '#3182ce' },
  ];

  mostrarModalCultivo = false;
  mensajeCultivo      = '';
  nuevoCultivo        = { nombre: '', variedades: null as any, color: '#38a169' };

  abrirModalCultivo()  { this.mostrarModalCultivo = true;  this.mensajeCultivo = ''; }
  cerrarModalCultivo() { this.mostrarModalCultivo = false; this.nuevoCultivo = { nombre: '', variedades: null, color: '#38a169' }; }

  agregarCultivo() {
    if (!this.nuevoCultivo.nombre.trim() || !this.nuevoCultivo.variedades) {
      this.mensajeCultivo = 'Complete todos los campos obligatorios.';
      return;
    }
    this.cultivos.push({ ...this.nuevoCultivo });
    this.cerrarModalCultivo();
  }

  eliminarCultivo(i: number) { this.cultivos.splice(i, 1); }

  // ═══ USUARIOS ══════════════════════════════════════════════
  usuarios: any[] = [
    { nombre: 'Elías Navarro',    email: 'e.navarro@pedregal.com',    rol: 'Administrador', estado: true  },
    { nombre: 'Brígida Torres',   email: 'b.torres@pedregal.com',     rol: 'Administrador', estado: true  },
    { nombre: 'Miguel Arrieta',   email: 'm.arrieta@pedregal.com',    rol: 'Supervisor',    estado: true  },
    { nombre: 'Sofia Valdivia',   email: 's.valdivia@pedregal.com',   rol: 'Supervisor',    estado: true  },
    { nombre: 'Jorge Ramírez',    email: 'j.ramirez@pedregal.com',    rol: 'Supervisor',    estado: true  },
    { nombre: 'Luis Campos',      email: 'l.campos@pedregal.com',     rol: 'Operario',      estado: false },
    { nombre: 'Ana Quispe',       email: 'a.quispe@pedregal.com',     rol: 'Operario',      estado: true  },
    { nombre: 'Carlos Mendoza',   email: 'c.mendoza@pedregal.com',    rol: 'Operario',      estado: false },
  ];

  nuevoUsuario   = { nombre: '', email: '', rol: 'Supervisor' };
  mensajeUsuario = '';
  filtroRol      = '';
  busquedaUsuario = '';

  get usuariosFiltrados() {
    return this.usuarios.filter(u => {
      const matchRol     = !this.filtroRol      || u.rol === this.filtroRol;
      const matchBusqueda = !this.busquedaUsuario ||
        u.nombre.toLowerCase().includes(this.busquedaUsuario.toLowerCase()) ||
        u.email.toLowerCase().includes(this.busquedaUsuario.toLowerCase());
      return matchRol && matchBusqueda;
    });
  }

  get totalAdmins() { return this.usuarios.filter(u => u.rol === 'Administrador').length; }
  get totalStaff()  { return this.usuarios.filter(u => u.rol !== 'Administrador').length; }

  getIniciales(nombre: string): string {
    if (!nombre) return '?';
    return nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  getColorAvatar(nombre: string): string {
    const colores = ['#e53e3e','#dd6b20','#d69e2e','#38a169','#3182ce','#805ad5','#d53f8c'];
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    return colores[Math.abs(hash) % colores.length];
  }

  crearUsuario() {
    if (!this.nuevoUsuario.nombre.trim() || !this.nuevoUsuario.email.trim()) {
      this.mensajeUsuario = 'error:Nombre y correo son obligatorios.';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.nuevoUsuario.email)) {
      this.mensajeUsuario = 'error:Ingrese un correo electrónico válido.';
      return;
    }
    if (this.usuarios.some(u => u.email === this.nuevoUsuario.email)) {
      this.mensajeUsuario = 'error:Este correo ya está registrado.';
      return;
    }
    this.usuarios.push({ ...this.nuevoUsuario, estado: true });
    this.nuevoUsuario  = { nombre: '', email: '', rol: 'Supervisor' };
    this.mensajeUsuario = 'ok:Usuario creado correctamente.';
    setTimeout(() => this.mensajeUsuario = '', 3000);
  }

  getMensajeTipo()  { return this.mensajeUsuario.startsWith('ok:')    ? 'ok'    : 'error'; }
  getMensajeTexto() { return this.mensajeUsuario.replace(/^(ok|error):/, ''); }

  toggleEstadoUsuario(usuario: any) { usuario.estado = !usuario.estado; }
  eliminarUsuario(i: number)        { this.usuarios.splice(i, 1); }

  // ═══ LOTES ═════════════════════════════════════════════════
  fundoSeleccionado     = 'Fundo San José';
  mostrarDropdownFundo  = false;
  loteSeleccionado: any = null;
  lotesSeleccionados: any[] = [];
  capacidadTotal        = 84;

  lotesPorFundo: { [key: string]: any[] } = {
    'Fundo San José': [
      { nombre: 'Lote A1', hectareas: 12.5, cultivo: 'Uva de Mesa', estado: 'Activo',   x: 22, y: 28, seleccionado: false },
      { nombre: 'Lote A2', hectareas: 8.3,  cultivo: 'Espárrago',   estado: 'Activo',   x: 47, y: 40, seleccionado: false },
      { nombre: 'Lote B1', hectareas: 15.0, cultivo: 'Uva de Mesa', estado: 'Inactivo', x: 67, y: 58, seleccionado: false },
      { nombre: 'Lote B2', hectareas: 6.7,  cultivo: 'Palto Has',   estado: 'Activo',   x: 32, y: 70, seleccionado: false },
    ],
    'Fundo Santa Rosa': [
      { nombre: 'Lote C1', hectareas: 18.0, cultivo: 'Arándanos',   estado: 'Activo',   x: 30, y: 35, seleccionado: false },
      { nombre: 'Lote C2', hectareas: 9.5,  cultivo: 'Espárrago',   estado: 'Activo',   x: 55, y: 55, seleccionado: false },
      { nombre: 'Lote D1', hectareas: 11.2, cultivo: 'Palto Has',   estado: 'Inactivo', x: 70, y: 30, seleccionado: false },
    ],
    'Fundo Yaurilla': [
      { nombre: 'Lote Y1', hectareas: 20.0, cultivo: 'Uva de Mesa', estado: 'Activo',   x: 25, y: 45, seleccionado: false },
      { nombre: 'Lote Y2', hectareas: 14.5, cultivo: 'Arándanos',   estado: 'Activo',   x: 60, y: 65, seleccionado: false },
    ],
  };

  get lotesDelFundo(): any[] {
    return this.lotesPorFundo[this.fundoSeleccionado] ?? [];
  }

  toggleDropdownFundo() { this.mostrarDropdownFundo = !this.mostrarDropdownFundo; }

  seleccionarFundo(nombre: string) {
    this.fundoSeleccionado    = nombre;
    this.mostrarDropdownFundo = false;
    this.loteSeleccionado     = null;
    this.lotesSeleccionados   = [];
    (this.lotesPorFundo[nombre] ?? []).forEach((l: any) => l.seleccionado = false);
  }

  seleccionarLote(lote: any) {
    this.lotesDelFundo.forEach(l => l.seleccionado = false);
    lote.seleccionado       = true;
    this.loteSeleccionado   = lote;
    this.lotesSeleccionados = this.lotesDelFundo.filter(l => l.seleccionado);
  }

  editarLote() {
    if (!this.loteSeleccionado) return;
    this.mostrarModalEditarLote = true;
    this.loteEditando = { ...this.loteSeleccionado };
  }

  eliminarLote() {
    if (!this.loteSeleccionado) return;
    const fundo = this.lotesPorFundo[this.fundoSeleccionado];
    const idx   = fundo.indexOf(this.loteSeleccionado);
    if (idx > -1) fundo.splice(idx, 1);
    this.loteSeleccionado   = null;
    this.lotesSeleccionados = [];
  }

  // Modal editar lote
  mostrarModalEditarLote = false;
  loteEditando: any      = {};

  guardarLote() {
    const fundo = this.lotesPorFundo[this.fundoSeleccionado];
    const idx   = fundo.findIndex((l: any) => l === this.loteSeleccionado);
    if (idx > -1) {
      fundo[idx]           = { ...this.loteEditando, seleccionado: true };
      this.loteSeleccionado = fundo[idx];
    }
    this.mostrarModalEditarLote = false;
  }

  cerrarModalEditarLote() { this.mostrarModalEditarLote = false; }

  ngOnInit() {}
}