import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Trabajador,IJefeCampo,IParteDiario,ITrabajador } from '../staff/trabajador';
@Component({
  selector: 'app-crear-parte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear_parte.html',
  styleUrl: './crear_parte.css'
})
export class Crear_Parte implements OnInit {
 // Paso 0: selección de jefe
  pasoActual = 0;
  jefesDeCampo: IJefeCampo[] = [];
  jefeSeleccionado: IJefeCampo | null = null;
  busquedaJefe = '';
  modoCrearJefe = false;
 
  nuevoJefe = {
    nombre: '',
    zona: '',
    rol: ''
  };
 
  mensajeExito = ''; // Notification message

  // Pasos 1-4
  busquedaPersonal = '';
  verTodos = false;
  unidadMedida = 'Kg';
 
  config = {
    campana: 'Campaña 2023-2024',
    cultivo: 'Uva de Mesa - Red Globe',
    fundo: 'Don Alfonso',
    lote: 'L-014',
    labor: ''
  };
 
  produccionAvanzada = 0;
  metaDiaria = 2450;
  produccionPct = 0;
 
  personal: any[] = [];
  registrosProduccion: any[] = [
    { descripcion: '', cantidad: 0, hora: '' }
  ];
 
  // Modal de nuevo trabajador
  modoCrearTrabajador = false;
  nuevoTrabajador = {
    nombre: '',
    dni: '',
    cargo: 'Operario',
    asistencia: 'PRESENTE',
    horaInicio: '07:00',
    horaFin: '16:00',
    rendimiento: 0,
    labor: 'Cosecha de Uva',
    lote: '',
    horasLaboradas: 8,
    costoTraducido: 0,
    cajas: 0,
    metaBase: 10,
    estado: 'Regular',
    epps: '',
    restricciones: 'Ninguna',
    fechaNacimiento: '',
    genero: 'Masculino',
    grupoSanguineo: 'O+',
    alergias: 'Ninguna'
  };
  errorNuevoTrabajador = '';
 
  constructor(private router: Router, private trabajador: Trabajador, private cdr: ChangeDetectorRef) {}
 
  ngOnInit(): void {
    this.jefesDeCampo = this.trabajador.getJefesDeCampo();
  }
 
  // ─── PASO 0: JEFE DE CAMPO ──────────────────────────────────
 
  get jefesFiltrados(): IJefeCampo[] {
    if (!this.busquedaJefe.trim()) return this.jefesDeCampo;
    const q = this.busquedaJefe.toLowerCase();
    return this.jefesDeCampo.filter(j =>
      j.nombre.toLowerCase().includes(q) || j.zona.toLowerCase().includes(q)
    );
  }
 
  seleccionarJefe(jefe: IJefeCampo): void {
    this.jefeSeleccionado = jefe;
    // Cargar personal del jefe
    this.personal = jefe.trabajadores.map(t => ({
      iniciales: t.nombre.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
      nombre: t.nombre,
      cargo: t.labor,
      dni: t.dni,
      asistencia: 'PRESENTE',
      horaInicio: '07:00 AM',
      horaFin: '04:00 PM',
      cajas: t.cajas,
      metaBase: t.metaBase,
      horasLaboradas: t.horasLaboradas,
      rendimiento: t.rendimiento,
    }));
    this.config.lote = jefe.zona;
    this.config.fundo = jefe.zona.includes('Fundo') ? jefe.zona.split('- ')[1] : jefe.zona;
    this.pasoActual = 1;
  }
 
  toggleCrearJefe(): void {
    this.modoCrearJefe = !this.modoCrearJefe;
    this.nuevoJefe = { nombre: '', zona: '', rol: '' };
  }
 
  crearJefe(): void {
    if (!this.nuevoJefe.nombre.trim() || !this.nuevoJefe.zona.trim()) return;
    const id = this.trabajador.generarIdJefe();
    const iniciales = this.nuevoJefe.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const jefe: IJefeCampo = {
      id,
      nombre: this.nuevoJefe.nombre.trim(),
      rol: this.nuevoJefe.rol.trim() || 'Jefe de Campo',
      zona: this.nuevoJefe.zona.trim(),
      totalACargo: 0,
      avatar: iniciales,
      trabajadores: []
    };
    this.trabajador.agregarJefeCampo(jefe);
    this.jefesDeCampo = this.trabajador.getJefesDeCampo();
    this.modoCrearJefe = false;
    this.seleccionarJefe(jefe);
  }
 
  // ─── PERSONAL ────────────────────────────────────────────────
 
  get personalFiltrado() {
    const lista = this.verTodos ? this.personal : this.personal.slice(0, 10);
    if (!this.busquedaPersonal) return lista;
    const q = this.busquedaPersonal.toLowerCase();
    return lista.filter((p: any) =>
      p.nombre.toLowerCase().includes(q) || p.dni.includes(q)
    );
  }
 
  get costoJornales(): number {
    const presentes = this.personal.filter(p => p.asistencia === 'PRESENTE').length;
    return presentes * 40;
  }
 
  get promedioRendimiento(): number {
    const presentes = this.personal.filter(p => p.asistencia === 'PRESENTE');
    if (!presentes.length) return 0;
    return presentes.reduce((sum: number, p: any) => sum + p.rendimiento, 0) / presentes.length;
  }
 
  get totalPresentes(): number {
    return this.personal.filter(p => p.asistencia === 'PRESENTE').length;
  }
 
  get totalFaltas(): number {
    return this.personal.filter(p => p.asistencia === 'FALTA').length;
  }
 
  toggleAsistencia(persona: any): void {
    persona.asistencia = persona.asistencia === 'PRESENTE' ? 'FALTA' : 'PRESENTE';
  }
 
  eliminarPersonal(dni: string): void {
    this.personal = this.personal.filter(p => p.dni !== dni);
  }
 
  // ─── CREAR TRABAJADOR ────────────────────────────────────────
 
  abrirCrearTrabajador(): void {
    this.modoCrearTrabajador = true;
    this.errorNuevoTrabajador = '';
    this.nuevoTrabajador = {
      nombre: '',
      dni: '',
      cargo: 'Operario',
      asistencia: 'PRESENTE',
      horaInicio: '07:00',
      horaFin: '16:00',
      rendimiento: 0,
      labor: this.config.labor || 'Cosecha de Uva',
      lote: this.config.lote,
      horasLaboradas: 8,
      costoTraducido: 0,
      cajas: 0,
      metaBase: 10,
      estado: 'Regular',
      epps: '',
      restricciones: 'Ninguna',
      fechaNacimiento: '',
      genero: 'Masculino',
      grupoSanguineo: 'O+',
      alergias: 'Ninguna'
    };
  }
 
  confirmarNuevoTrabajador(): void {
    if (!this.nuevoTrabajador.nombre.trim()) {
      this.errorNuevoTrabajador = 'El nombre es obligatorio.';
      return;
    }
    if (!this.nuevoTrabajador.dni.trim() || this.nuevoTrabajador.dni.length < 8) {
      this.errorNuevoTrabajador = 'Ingresa un DNI válido (mínimo 8 dígitos).';
      return;
    }
    const existe = this.personal.some(p => p.dni === this.nuevoTrabajador.dni);
    if (existe) {
      this.errorNuevoTrabajador = 'Ya existe un trabajador con ese DNI en este parte.';
      return;
    }
 
    const iniciales = this.nuevoTrabajador.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const entrada = {
      iniciales,
      nombre: this.nuevoTrabajador.nombre.trim(),
      cargo: this.nuevoTrabajador.cargo,
      dni: this.nuevoTrabajador.dni.trim(),
      asistencia: this.nuevoTrabajador.asistencia,
      horaInicio: this.nuevoTrabajador.horaInicio,
      horaFin: this.nuevoTrabajador.horaFin,
      cajas: this.nuevoTrabajador.cajas,
      metaBase: this.nuevoTrabajador.metaBase,
      horasLaboradas: this.nuevoTrabajador.horasLaboradas,
      rendimiento: this.nuevoTrabajador.rendimiento
    };
 
    this.personal = [...this.personal, entrada];
 
    // Persistir en el servicio también para que aparezca en Staff
    if (this.jefeSeleccionado) {
      this.trabajador.agregarTrabajadorAJefe(this.jefeSeleccionado.id, {
        dni: this.nuevoTrabajador.dni.trim(),
        nombre: this.nuevoTrabajador.nombre.trim(),
        labor: this.nuevoTrabajador.labor,
        lote: this.nuevoTrabajador.lote || this.jefeSeleccionado.zona,
        horasLaboradas: this.nuevoTrabajador.horasLaboradas,
        costoTraducido: 0,
        cajas: this.nuevoTrabajador.cajas,
        metaBase: this.nuevoTrabajador.metaBase,
        rendimiento: this.nuevoTrabajador.rendimiento,
        estado: this.nuevoTrabajador.estado,
        epps: this.nuevoTrabajador.epps || 'Pendiente',
        restricciones: this.nuevoTrabajador.restricciones,
        fechaNacimiento: this.nuevoTrabajador.fechaNacimiento,
        genero: this.nuevoTrabajador.genero,
        grupoSanguineo: this.nuevoTrabajador.grupoSanguineo,
        alergias: this.nuevoTrabajador.alergias
      });
    }
 
    this.modoCrearTrabajador = false;
    this.errorNuevoTrabajador = '';
  }
 
  cancelarNuevoTrabajador(): void {
    this.modoCrearTrabajador = false;
    this.errorNuevoTrabajador = '';
  }
 
  // ─── PRODUCCIÓN ──────────────────────────────────────────────
 
  calcularPct(): void {
    this.produccionPct = Math.min(100, Math.round((this.produccionAvanzada / this.metaDiaria) * 100));
  }
 
  anadirRegistro(): void {
    this.registrosProduccion.push({ descripcion: '', cantidad: 0, hora: '' });
  }
 
  eliminarRegistro(i: number): void {
    this.registrosProduccion.splice(i, 1);
  }
 
  // ─── NAVEGACIÓN ──────────────────────────────────────────────
 
  irAPaso(paso: number): void {
    if (paso <= this.pasoActual && paso >= 0) {
      if (paso === 0) {
        this.jefeSeleccionado = null;
        this.pasoActual = 0;
      } else {
        this.pasoActual = paso;
      }
    }
  }
 
  siguientePaso(): void {
    if (this.pasoActual < 4) this.pasoActual++;
  }
 
  mostrarNotificacion(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.mensajeExito = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  guardarBorrador(): void {
    this._persistirParte('borrador');
    this.mostrarNotificacion('Borrador guardado exitosamente.');
  }
 
  finalizarParte(): void {
    if (this.pasoActual < 4) {
      this.pasoActual = 4;
      return;
    }
    this._persistirParte('finalizado');
    this.mostrarNotificacion('¡Parte diario finalizado y enviado! Los datos se reflejarán en el Dashboard.');
    setTimeout(() => {
      this.cerrar();
    }, 1500);
  }
 
  private _persistirParte(estado: 'borrador' | 'finalizado'): void {
    const parte: IParteDiario = {
      id: 'PARTE-' + Date.now(),
      fecha: new Date().toLocaleDateString('es-PE'),
      jefeId: this.jefeSeleccionado?.id || '',
      jefeNombre: this.jefeSeleccionado?.nombre || '',
      campana: this.config.campana,
      cultivo: this.config.cultivo,
      fundo: this.config.fundo,
      lote: this.config.lote,
      labor: this.config.labor,
      produccionAvanzada: this.produccionAvanzada,
      metaDiaria: this.metaDiaria,
      personal: [...this.personal],
      registrosProduccion: [...this.registrosProduccion],
      estado
    };
    this.trabajador.guardarParte(parte);
  }
 
  cerrar(): void {
    this.router.navigate(['/dashboard']);
  }
 
  cerrarOverlay(event: Event): void {
    this.cerrar();
  }
}