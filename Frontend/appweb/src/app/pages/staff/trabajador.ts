import { Injectable } from '@angular/core';



export interface ITrabajador {
  dni: string;
  nombre: string;
  labor: string;
  lote: string;
  horasLaboradas: number;
  costoTraducido: number;
  cajas: number;
  metaBase: number;
  rendimiento: number;
  estado: string;
  epps: string;
  restricciones: string;
  fechaNacimiento?: string;
  genero?: string;
  grupoSanguineo?: string;
  alergias?: string;
}

export interface IJefeCampo {
  id: string;
  nombre: string;
  rol: string;
  zona: string;
  totalACargo: number;
  avatar: string;
  trabajadores: ITrabajador[];
}

export interface IParteDiario {
  id: string;
  fecha: string;
  jefeId: string;
  jefeNombre: string;
  campana: string;
  cultivo: string;
  fundo: string;
  lote: string;
  labor: string;
  produccionAvanzada: number;
  metaDiaria: number;
  personal: any[];
  registrosProduccion: any[];
  estado: 'borrador' | 'finalizado';
}

const STORAGE_KEYS = {
  JEFES: 'agro_jefes_campo',
  PARTES: 'agro_partes_diarios',
};

const JEFES_INICIALES: IJefeCampo[] = [
  {
    id: 'SUP-001', nombre: 'Brígida Torres', rol: 'Jefe de Campo / Cuadrilla A',
    zona: 'Lote 12 - Fundo Yaurilla', totalACargo: 10, avatar: 'BT',
    trabajadores: [
      { dni: '45678912', nombre: 'Juan Carlos Ramos', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 180, cajas: 5, metaBase: 10, rendimiento: 50, estado: 'Crítico', epps: 'Sí (Guantes, Tijera, Lentes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'O+', alergias: 'Ninguna' },
      { dni: '40897654', nombre: 'Carlos Mendoza Loza', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0, cajas: 9, metaBase: 10, rendimiento: 90, estado: 'Óptimo', epps: 'Sí (Guantes, Tijera, Lentes)', restricciones: 'Evitar cargas pesadas', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'A+', alergias: 'Ninguna' },
      { dni: '44321678', nombre: 'Pedro Palacios Vega', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 45, cajas: 7.5, metaBase: 10, rendimiento: 75, estado: 'Regular', epps: 'Sí (Guantes, Tijera)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'B+', alergias: 'Ninguna' },
      { dni: '41234567', nombre: 'Ana Gamarra Ruiz', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 210, cajas: 4, metaBase: 10, rendimiento: 40, estado: 'Crítico', epps: 'Sí (Guantes, Lentes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Femenino', grupoSanguineo: 'O-', alergias: 'Ninguna' },
      { dni: '42345678', nombre: 'Luis Alberto Rojas', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0, cajas: 11, metaBase: 10, rendimiento: 110, estado: 'Óptimo', epps: 'Sí (Guantes, Tijera, Lentes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'A-', alergias: 'Ninguna' },
      { dni: '43456789', nombre: 'María Elena Flores', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 20, cajas: 8, metaBase: 10, rendimiento: 80, estado: 'Regular', epps: 'Sí (Guantes, Lentes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Femenino', grupoSanguineo: 'B-', alergias: 'Ninguna' },
      { dni: '45567890', nombre: 'Jorge Díaz Hurtado', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 195, cajas: 4.8, metaBase: 10, rendimiento: 48, estado: 'Crítico', epps: 'Sí (Guantes, Tijera)', restricciones: 'Problemas lumbares', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'O+', alergias: 'Ninguna' },
      { dni: '46678901', nombre: 'Lucía Méndez Castro', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0, cajas: 9.5, metaBase: 10, rendimiento: 95, estado: 'Óptimo', epps: 'Sí (Guantes, Tijera, Lentes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Femenino', grupoSanguineo: 'A+', alergias: 'Ninguna' },
      { dni: '47789012', nombre: 'Raúl Espino Soto', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 35, cajas: 7.8, metaBase: 10, rendimiento: 78, estado: 'Regular', epps: 'Sí (Guantes, Lentes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'B+', alergias: 'Ninguna' },
      { dni: '48890123', nombre: 'Sofia Vargas Luna', labor: 'Cosecha de Uva', lote: 'Lote 12 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0, cajas: 10, metaBase: 10, rendimiento: 100, estado: 'Óptimo', epps: 'Sí (Guantes, Tijera, Lentes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Femenino', grupoSanguineo: 'O+', alergias: 'Ninguna' },
    ]
  },
  {
    id: 'SUP-002', nombre: 'Elias Navarro', rol: 'Jefe de Campo / Cuadrilla B',
    zona: 'Lote 08 - Fundo Yaurilla', totalACargo: 10, avatar: 'EN',
    trabajadores: [
      { dni: '10234567', nombre: 'Mateo Quispe Huamán', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0, cajas: 12, metaBase: 10, rendimiento: 120, estado: 'Óptimo', epps: 'Sí (Tijera larga, Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'O+', alergias: 'Ninguna' },
      { dni: '11345678', nombre: 'Diana Peralta Solis', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 150, cajas: 5.5, metaBase: 10, rendimiento: 55, estado: 'Crítico', epps: 'Sí (Tijera larga, Guantes)', restricciones: 'Hipertensión', fechaNacimiento: '', genero: 'Femenino', grupoSanguineo: 'A+', alergias: 'Ninguna' },
      { dni: '12456789', nombre: 'Andrés Gutiérrez Paz', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 50, cajas: 7.2, metaBase: 10, rendimiento: 72, estado: 'Regular', epps: 'Sí (Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'B+', alergias: 'Ninguna' },
      { dni: '13567890', nombre: 'Carmen Tello Rivas', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0, cajas: 9.2, metaBase: 10, rendimiento: 92, estado: 'Óptimo', epps: 'Sí (Tijera larga, Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Femenino', grupoSanguineo: 'O-', alergias: 'Ninguna' },
      { dni: '14678901', nombre: 'Manuel Benavides C.', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 160, cajas: 5.2, metaBase: 10, rendimiento: 52, estado: 'Crítico', epps: 'Sí (Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'A-', alergias: 'Ninguna' },
      { dni: '15789012', nombre: 'Rosa Angulo Farfán', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 40, cajas: 7.6, metaBase: 10, rendimiento: 76, estado: 'Regular', epps: 'Sí (Tijera larga, Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Femenino', grupoSanguineo: 'B-', alergias: 'Ninguna' },
      { dni: '16890123', nombre: 'Félix Marín Cordero', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0, cajas: 9.8, metaBase: 10, rendimiento: 98, estado: 'Óptimo', epps: 'Sí (Tijera larga, Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'O+', alergias: 'Ninguna' },
      { dni: '17901234', nombre: 'Elena Miranda Tueros', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 145, cajas: 5.8, metaBase: 10, rendimiento: 58, estado: 'Crítico', epps: 'Sí (Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Femenino', grupoSanguineo: 'A+', alergias: 'Ninguna' },
      { dni: '18012345', nombre: 'Hugo Salvatierra M.', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 30, cajas: 7.9, metaBase: 10, rendimiento: 82, estado: 'Regular', epps: 'Sí (Tijera larga, Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'B+', alergias: 'Ninguna' },
      { dni: '19123456', nombre: 'Camila Falconi Vega', labor: 'Poda de Vid', lote: 'Lote 08 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0, cajas: 10.5, metaBase: 10, rendimiento: 105, estado: 'Óptimo', epps: 'Sí (Tijera larga, Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Femenino', grupoSanguineo: 'O+', alergias: 'Ninguna' },
    ]
  },
  {
    id: 'SUP-003', nombre: 'Jorge Ramírez', rol: 'Jefe de Campo / Cuadrilla C',
    zona: 'Lote 04 - Fundo Yaurilla', totalACargo: 10, avatar: 'JR',
    trabajadores: [
      { dni: '70123456', nombre: 'Ricardo Álvaro Solano', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 55, cajas: 7.0, metaBase: 10, rendimiento: 70, estado: 'Regular', epps: 'Sí (Tijeras Corvas, Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'O+', alergias: 'Ninguna' },
      { dni: '71234567', nombre: 'Patricia Fuentes Ortiz', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0, cajas: 9.6, metaBase: 10, rendimiento: 96, estado: 'Óptimo', epps: 'Sí (Tijeras Corvas, Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Femenino', grupoSanguineo: 'A+', alergias: 'Ninguna' },
      { dni: '72345678', nombre: 'Gabriel Cáceres Leyva', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 175, cajas: 4.9, metaBase: 10, rendimiento: 49, estado: 'Crítico', epps: 'Sí (Guantes)', restricciones: 'Evaluación médica pendiente', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'B+', alergias: 'Ninguna' },
      { dni: '73456789', nombre: 'Verónica Saavedra P.', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0, cajas: 10.2, metaBase: 10, rendimiento: 102, estado: 'Óptimo', epps: 'Sí (Tijeras Corvas, Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Femenino', grupoSanguineo: 'O-', alergias: 'Ninguna' },
      { dni: '74567890', nombre: 'Walter Yáñez Ramos', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 45, cajas: 7.4, metaBase: 10, rendimiento: 74, estado: 'Regular', epps: 'Sí (Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'A-', alergias: 'Ninguna' },
      { dni: '75678901', nombre: 'Nancy Palomino Chu', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 185, cajas: 4.5, metaBase: 10, rendimiento: 45, estado: 'Crítico', epps: 'Sí (Tijeras Corvas, Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Femenino', grupoSanguineo: 'B-', alergias: 'Ninguna' },
      { dni: '76789012', nombre: 'Christian Neyra Torres', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0, cajas: 9.1, metaBase: 10, rendimiento: 91, estado: 'Óptimo', epps: 'Sí (Tijeras Corvas, Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'O+', alergias: 'Ninguna' },
      { dni: '77890123', nombre: 'Sonia Alva Meléndez', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 35, cajas: 7.9, metaBase: 10, rendimiento: 79, estado: 'Regular', epps: 'Sí (Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Femenino', grupoSanguineo: 'A+', alergias: 'Ninguna' },
      { dni: '78901234', nombre: 'Tomas Bendezú Prado', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 0, cajas: 11.2, metaBase: 10, rendimiento: 112, estado: 'Óptimo', epps: 'Sí (Tijeras Corvas, Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Masculino', grupoSanguineo: 'B+', alergias: 'Ninguna' },
      { dni: '79012345', nombre: 'Isabel Cárdenas Gil', labor: 'Raleo de Racimos', lote: 'Lote 04 - Fundo Yaurilla', horasLaboradas: 8, costoTraducido: 200, cajas: 4.0, metaBase: 10, rendimiento: 40, estado: 'Crítico', epps: 'Sí (Guantes)', restricciones: 'Ninguna', fechaNacimiento: '', genero: 'Femenino', grupoSanguineo: 'O-', alergias: 'Ninguna' },
    ]
  }
];
 

@Injectable({
  providedIn: 'root'
})
export class Trabajador {

   private jefesDeCampo: IJefeCampo[] = [];
  private partesDiarios: IParteDiario[] = [];
 
  constructor() {
    this._cargarDesdeStorage();
  }
 
  // ─── STORAGE ─────────────────────────────────────────────────
 
  private _cargarDesdeStorage(): void {
    try {
      const jefesRaw = localStorage.getItem(STORAGE_KEYS.JEFES);
      this.jefesDeCampo = jefesRaw
        ? JSON.parse(jefesRaw)
        : JSON.parse(JSON.stringify(JEFES_INICIALES));
 
      const partesRaw = localStorage.getItem(STORAGE_KEYS.PARTES);
      this.partesDiarios = partesRaw ? JSON.parse(partesRaw) : [];
    } catch {
      this.jefesDeCampo = JSON.parse(JSON.stringify(JEFES_INICIALES));
      this.partesDiarios = [];
    }
  }
 
  private _guardarJefes(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.JEFES, JSON.stringify(this.jefesDeCampo));
    } catch (e) {
      console.error('Error guardando jefes en localStorage:', e);
    }
  }
 
  private _guardarPartes(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PARTES, JSON.stringify(this.partesDiarios));
    } catch (e) {
      console.error('Error guardando partes en localStorage:', e);
    }
  }
 
  /** Borra todo y restaura datos de muestra */
  resetStorage(): void {
    localStorage.removeItem(STORAGE_KEYS.JEFES);
    localStorage.removeItem(STORAGE_KEYS.PARTES);
    this._cargarDesdeStorage();
  }
 
  // ─── JEFES DE CAMPO ──────────────────────────────────────────
 
  getJefesDeCampo(): IJefeCampo[] { return this.jefesDeCampo; }
 
  getJefePorId(id: string): IJefeCampo | undefined {
    return this.jefesDeCampo.find(j => j.id === id);
  }
 
  agregarJefeCampo(jefe: IJefeCampo): void {
    this.jefesDeCampo.push(jefe);
    this._guardarJefes();
  }
 
  generarIdJefe(): string {
    return 'SUP-' + String(this.jefesDeCampo.length + 1).padStart(3, '0');
  }
 
  // ─── TRABAJADORES ────────────────────────────────────────────
 
  obtenerTrabajadorPorDni(dni: string): ITrabajador | null {
    for (const jefe of this.jefesDeCampo) {
      const found = jefe.trabajadores.find(t => t.dni === dni);
      if (found) return { ...found };
    }
    return null;
  }
 
  actualizarTrabajador(mod: ITrabajador): void {
    mod.rendimiento = this._calcRendimiento(mod.cajas, mod.metaBase);
    mod.estado = this._calcEstado(mod.rendimiento);
    for (const jefe of this.jefesDeCampo) {
      const idx = jefe.trabajadores.findIndex(t => t.dni === mod.dni);
      if (idx !== -1) {
        jefe.trabajadores[idx] = { ...mod };
        jefe.trabajadores = [...jefe.trabajadores];
        this._guardarJefes();
        return;
      }
    }
  }
 
  agregarTrabajadorAJefe(jefeId: string, trabajador: ITrabajador): void {
    const jefe = this.jefesDeCampo.find(j => j.id === jefeId);
    if (jefe) {
      jefe.trabajadores = [...jefe.trabajadores, { ...trabajador }];
      jefe.totalACargo = jefe.trabajadores.length;
      this._guardarJefes();
    }
  }
 
  /** Llamado al finalizar un parte: sincroniza cajas/hr de cada trabajador */
  actualizarCajasDesdePartePersonal(personal: any[]): void {
    for (const p of personal) {
      if (!p.dni) continue;
      for (const jefe of this.jefesDeCampo) {
        const idx = jefe.trabajadores.findIndex(t => t.dni === p.dni);
        if (idx !== -1) {
          const t = jefe.trabajadores[idx];
          const cajas = (p.cajas != null) ? Number(p.cajas) : t.cajas;
          const rendimiento = this._calcRendimiento(cajas, t.metaBase);
          jefe.trabajadores[idx] = {
            ...t,
            cajas,
            rendimiento,
            estado: this._calcEstado(rendimiento),
            horasLaboradas: p.horasLaboradas ?? t.horasLaboradas,
          };
        }
      }
    }
    this._guardarJefes();
  }
 
  // ─── HELPERS ─────────────────────────────────────────────────
 
  private _calcRendimiento(cajas: number, metaBase: number): number {
    if (!metaBase) return 0;
    return Math.round((cajas / metaBase) * 100);
  }
 
  private _calcEstado(rendimiento: number): string {
    if (rendimiento >= 90) return 'Óptimo';
    if (rendimiento >= 70) return 'Regular';
    return 'Crítico';
  }
 
  // ─── PARTES DIARIOS ──────────────────────────────────────────
 
  guardarParte(parte: IParteDiario): void {
    const idx = this.partesDiarios.findIndex(p => p.id === parte.id);
    if (idx !== -1) {
      this.partesDiarios[idx] = { ...parte };
    } else {
      this.partesDiarios.push({ ...parte });
    }
    if (parte.estado === 'finalizado') {
      this.actualizarCajasDesdePartePersonal(parte.personal);
    }
    this._guardarPartes();
  }
 
  getPartesDiarios(): IParteDiario[] { return this.partesDiarios; }
  getPartesFinalizados(): IParteDiario[] {
    return this.partesDiarios.filter(p => p.estado === 'finalizado');
  }
 
  // ─── KPIs ────────────────────────────────────────────────────
 
  getTotalPersonalActivo(): number {
    return this.jefesDeCampo.reduce((s, j) => s + j.trabajadores.length, 0);
  }
 
  getTotalProduccion(): number {
    return this.getPartesFinalizados().reduce((s, p) => s + (p.produccionAvanzada || 0), 0);
  }
 
  getMetaTotalProduccion(): number {
    const partes = this.getPartesFinalizados();
    return partes.length ? partes.reduce((s, p) => s + (p.metaDiaria || 0), 0) : 2450;
  }
 
  getPorcentajeAvanceCosecha(): number {
    const total = this.getTotalProduccion();
    const meta = this.getMetaTotalProduccion();
    if (!total) return 0;
    return Math.min(100, Math.round((total / meta) * 1000) / 10);
  }
 
  getCostoImproductividad(): number {
    return this.getPartesFinalizados()
      .reduce((s, p) => s + p.personal.filter((per: any) => per.asistencia === 'FALTA').length * 40, 0);
  }
 
  getRankingGrupos(): { nombre: string; lider: string; rendimiento: number }[] {
    return this.jefesDeCampo.map(jefe => {
      const partes = this.partesDiarios.filter(p => p.jefeId === jefe.id && p.estado === 'finalizado');
      let rend: number;
      if (partes.length) {
        const ultimo = partes[partes.length - 1];
        const presentes = ultimo.personal.filter((p: any) => p.asistencia === 'PRESENTE');
        rend = presentes.length
          ? Math.round(presentes.reduce((s: number, p: any) => s + (p.rendimiento || 0), 0) / presentes.length)
          : 0;
      } else {
        const ts = jefe.trabajadores;
        rend = ts.length
          ? Math.round(ts.reduce((s, t) => s + t.rendimiento, 0) / ts.length)
          : 0;
      }
      return { nombre: jefe.nombre, lider: jefe.nombre, rendimiento: Math.min(100, rend) };
    }).sort((a, b) => b.rendimiento - a.rendimiento);
  }
}
