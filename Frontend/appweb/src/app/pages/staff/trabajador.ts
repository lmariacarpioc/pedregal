import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class Trabajador {

  private jefesDeCampo: IJefeCampo[] = [];
  private partesDiarios: IParteDiario[] = [];
  private sincronizado = false;
 
  constructor(private http: HttpClient) {
    this._cargarDesdeStorage();
    // Sincronizar con el backend al iniciar
    this.sincronizarConBackend();
  }
 
  // ─── SYNC CON BACKEND ──────────────────────────────────────
  
  async sincronizarConBackend(force: boolean = false): Promise<void> {
    if (this.sincronizado && !force) {
      return;
    }
    try {
      const data: any = await firstValueFrom(this.http.get(`${environment.apiUrl}/sync/download`));
      this.procesarPayloadSync(data);
      this.sincronizado = true;
    } catch (error) {
      console.error('No se pudo sincronizar con el backend, usando datos locales:', error);
      this.sincronizado = false;
    }
  }

  private procesarPayloadSync(payload: any) {
    // ─── Reconstruir Jefes de Campo desde usuarios con rol JEFE_CAMPO ───
    const supervisores = (payload.usuarios || []).filter(
      (u: any) => u.rol === 'JEFE_CAMPO' || u.rol === 'SUPERVISOR'
    );
    const todosLosTrabajadores = (payload.trabajadores || []);

    this.jefesDeCampo = supervisores.map((sup: any) => {
      // Mapear todos los trabajadores del backend a la estructura ITrabajador
      const trabs: ITrabajador[] = todosLosTrabajadores.map((t: any) => ({
        dni: t.dni || '',
        nombre: `${t.nombre || ''} ${t.apellido || ''}`.trim(),
        labor: t.cargo || 'Cosecha',
        lote: t.areaTrabajo || 'Lote General',
        horasLaboradas: 8,
        costoTraducido: 0,
        cajas: 0,
        metaBase: 10,
        rendimiento: 0,
        estado: t.activo ? 'Regular' : 'Crítico',
        epps: 'Sí',
        restricciones: 'Ninguna',
        fechaNacimiento: '',
        genero: '',
        grupoSanguineo: '',
        alergias: ''
      }));

      // Distribuir trabajadores equitativamente entre supervisores
      const chunkSize = Math.ceil(todosLosTrabajadores.length / (supervisores.length || 1));
      const supIndex = supervisores.indexOf(sup);
      const trabsAsignados = trabs.slice(supIndex * chunkSize, (supIndex + 1) * chunkSize);

      return {
        id: sup.syncId || `SUP-${sup.username || Date.now()}`,
        nombre: sup.nombreCompleto || sup.username || 'Sin nombre',
        rol: sup.rol || 'JEFE_CAMPO',
        zona: 'Asignación General',
        totalACargo: trabsAsignados.length,
        avatar: sup.nombreCompleto
          ? sup.nombreCompleto.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
          : 'US',
        trabajadores: trabsAsignados
      };
    });

    // ─── Reconstruir Partes Diarios desde el backend ───
    if (payload.partesDiarios && payload.partesDiarios.length > 0) {
      const partesBackend: IParteDiario[] = payload.partesDiarios.map((p: any) => {
        // Mapear detalles a la estructura de personal
        const personalDelParte = (p.detalles || []).map((d: any) => {
          // Buscar nombre del trabajador en la lista
          const trab = todosLosTrabajadores.find((t: any) => t.syncId === d.trabajadorSyncId);
          const nombreTrab = trab ? `${trab.nombre} ${trab.apellido}`.trim() : (d.trabajadorSyncId || 'Desconocido');
          return {
            dni: trab?.dni || d.trabajadorSyncId || '',
            nombre: nombreTrab,
            asistencia: d.estadoAsistencia || 'PRESENTE',
            horaInicio: d.horaEntrada || '07:00',
            horaFin: d.horaSalida || '16:00',
            cajas: d.cantidad || 0,
            metaBase: 10,
            horasLaboradas: 8,
            rendimiento: d.cantidad ? Math.round((d.cantidad / 10) * 100) : 0,
            cargo: d.tipoActividad || 'Cosecha'
          };
        });

        // Buscar nombre del jefe
        const jefe = (payload.usuarios || []).find((u: any) => u.syncId === p.usuarioSyncId);
        const jefeNombre = jefe?.nombreCompleto || p.usuarioSyncId || '';

        return {
          id: p.syncId || `PARTE-${Date.now()}`,
          fecha: p.fecha || new Date().toISOString().split('T')[0],
          jefeId: p.usuarioSyncId || '',
          jefeNombre: jefeNombre,
          campana: 'Campaña Actual',
          cultivo: p.clima || 'Uva de Mesa',
          fundo: 'Fundo Yaurilla',
          lote: 'Lote General',
          labor: p.turno || 'Mañana',
          produccionAvanzada: personalDelParte.reduce((s: number, per: any) => s + (per.cajas || 0), 0),
          metaDiaria: personalDelParte.length * 10,
          personal: personalDelParte,
          registrosProduccion: [],
          estado: (p.estado === 'finalizado' ? 'finalizado' : 'borrador') as 'borrador' | 'finalizado'
        };
      });

      // Merge partes del backend con partes locales (evitar duplicados por syncId)
      const syncIdsBackend = new Set(partesBackend.map(p => p.id));
      const partesLocalesSinDuplicados = this.partesDiarios.filter(p => !syncIdsBackend.has(p.id));
      this.partesDiarios = [...partesBackend, ...partesLocalesSinDuplicados];
    }

    // Guardar cambios locales
    this._guardarJefes();
    this._guardarPartes();
  }

  esSincronizado(): boolean {
    return this.sincronizado;
  }

  // ─── STORAGE ─────────────────────────────────────────────────
 
  private _cargarDesdeStorage(): void {
    try {
      const jefesRaw = localStorage.getItem(STORAGE_KEYS.JEFES);
      this.jefesDeCampo = jefesRaw ? JSON.parse(jefesRaw) : [];
 
      const partesRaw = localStorage.getItem(STORAGE_KEYS.PARTES);
      this.partesDiarios = partesRaw ? JSON.parse(partesRaw) : [];
    } catch {
      this.jefesDeCampo = [];
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
 
  /** Borra todo y re-sincroniza con el backend */
  resetStorage(): void {
    localStorage.removeItem(STORAGE_KEYS.JEFES);
    localStorage.removeItem(STORAGE_KEYS.PARTES);
    this.jefesDeCampo = [];
    this.partesDiarios = [];
    this.sincronizarConBackend();
  }
 
  // ─── JEFES DE CAMPO ──────────────────────────────────────────
 
  getJefesDeCampo(): IJefeCampo[] { return this.jefesDeCampo; }
 
  getJefePorId(id: string): IJefeCampo | undefined {
    return this.jefesDeCampo.find(j => j.id === id);
  }
 
  agregarJefeCampo(jefe: IJefeCampo): void {
    this.jefesDeCampo.push(jefe);
    this._guardarJefes();

    // Sincronizar al backend como un usuario
    const payload = {
      username: jefe.nombre.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 100),
      passwordHash: '123456', // default password
      nombreCompleto: jefe.nombre,
      rol: jefe.rol.toUpperCase().replace(/\s+/g, '_'),
      email: jefe.nombre.toLowerCase().replace(/\s+/g, '') + '@pedregal.com',
      activo: true,
      syncId: jefe.id
    };

    this.http.post(`${environment.apiUrl}/usuarios`, payload).subscribe({
      next: (res) => console.log('Jefe creado en backend', res),
      error: (err) => console.error('Error creando jefe en backend', err)
    });
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

        // Sincronizar cambio al backend
        this._actualizarTrabajadorEnBackend(mod);
        return;
      }
    }
  }

  private _actualizarTrabajadorEnBackend(trab: ITrabajador): void {
    // Buscar por DNI en el backend y actualizar
    this.http.get<any[]>(`${environment.apiUrl}/trabajadores`).subscribe({
      next: (trabajadores) => {
        const encontrado = trabajadores.find(t => t.dni === trab.dni);
        if (encontrado) {
          const nombres = trab.nombre.split(' ');
          const payload = {
            ...encontrado,
            nombre: nombres[0] || trab.nombre,
            apellido: nombres.slice(1).join(' ') || '',
            cargo: trab.labor,
            areaTrabajo: trab.lote
          };
          this.http.put(`${environment.apiUrl}/trabajadores/${encontrado.id}`, payload).subscribe({
            next: () => console.log('Trabajador actualizado en backend'),
            error: (err: any) => console.error('Error actualizando trabajador en backend', err)
          });
        }
      },
      error: (err: any) => console.error('Error buscando trabajador en backend', err)
    });
  }
 
  agregarTrabajadorAJefe(jefeId: string, trabajador: ITrabajador): void {
    const jefe = this.jefesDeCampo.find(j => j.id === jefeId);
    if (jefe) {
      jefe.trabajadores = [...jefe.trabajadores, { ...trabajador }];
      jefe.totalACargo = jefe.trabajadores.length;
      this._guardarJefes();

      // Crear trabajador en el backend
      this._crearTrabajadorEnBackend(trabajador);
    }
  }

  private _crearTrabajadorEnBackend(trab: ITrabajador): void {
    const nombres = trab.nombre.split(' ');
    const payload = {
      syncId: `web-trab-${trab.dni}-${Date.now()}`,
      nombre: nombres[0] || trab.nombre,
      apellido: nombres.slice(1).join(' ') || '',
      dni: trab.dni,
      cargo: trab.labor,
      areaTrabajo: trab.lote,
      telefono: '',
      categoria: 'Operario',
      salarioDiario: 40.0,
      activo: true
    };
    this.http.post(`${environment.apiUrl}/sync/upload`, {
      dispositivoId: 'web',
      timestamp: new Date().toISOString(),
      trabajadores: [payload]
    }).subscribe({
      next: (res) => console.log('Trabajador sincronizado con backend', res),
      error: (err) => console.error('Error creando trabajador en backend', err)
    });
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
    this.subirParteAlBackend(parte);
  }

  private subirParteAlBackend(parte: IParteDiario) {
    const payload = {
      dispositivoId: 'web',
      timestamp: new Date().toISOString(),
      partesDiarios: [
        {
          syncId: parte.id,
          fecha: this._formatearFechaISO(parte.fecha),
          turno: parte.labor || 'Mañana',
          clima: parte.cultivo || 'Despejado',
          estado: parte.estado,
          usuarioSyncId: parte.jefeId,
          observacionesGenerales: `Campaña: ${parte.campana}, Fundo: ${parte.fundo}, Lote: ${parte.lote}`,
          detalles: parte.personal.map(p => ({
            syncId: `det-${parte.id}-${p.dni}`,
            trabajadorSyncId: p.dni,
            estadoAsistencia: p.asistencia,
            horaEntrada: p.horaInicio || '06:00',
            horaSalida: p.horaFin || '14:00',
            cantidad: p.cajas || 0,
            tipoActividad: p.cargo || 'Cosecha',
            tareaRealizada: p.cargo || 'Cosecha'
          }))
        }
      ]
    };

    this.http.post(`${environment.apiUrl}/sync/upload`, payload).subscribe({
      next: (res) => console.log('Parte sincronizado con backend', res),
      error: (err) => console.error('Error al subir parte al backend', err)
    });
  }

  private _formatearFechaISO(fecha: string): string {
    // Intenta convertir formatos como "23/06/2026" o "23/6/2026" a "2026-06-23"
    if (fecha.includes('-') && fecha.length === 10) return fecha; // ya está en ISO
    const partes = fecha.split('/');
    if (partes.length === 3) {
      const [dia, mes, anio] = partes;
      return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
    // Fallback: usar fecha actual
    return new Date().toISOString().split('T')[0];
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
