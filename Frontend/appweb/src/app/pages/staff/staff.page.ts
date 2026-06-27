import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Trabajador } from './trabajador';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './staff.page.html',
  styleUrl: './staff.page.css',
})
export class StaffPage implements OnInit, OnDestroy {

  supervisorSeleccionado: string | null = null;
  trabajadorDetalle: any | null = null;
  menuActivoId: string | null = null;
  textoBusqueda: string = '';
  jefesDeCampo: any[] = [];
  cargando = true;

  private routerSub!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private trabajador: Trabajador,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this._cargarDatos();

    // Cada vez que el router navega DE VUELTA a /staff, refrescar la vista
    // (cubre el caso de volver desde editar o crear trabajador)
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd && (e as NavigationEnd).urlAfterRedirects === '/staff')
    ).subscribe(() => this._refrescarVista());
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private async _cargarDatos(): Promise<void> {
    try {
      await this.trabajador.sincronizarConBackend(true);
    } finally {
      this.jefesDeCampo = this.trabajador.getJefesDeCampo();

      // Si viene queryParam ?jefe=SUP-001 desde el dashboard, abrir ese jefe
      const jefeParam = this.route.snapshot.queryParamMap.get('jefe');
      if (jefeParam && this.jefesDeCampo.find(j => j.id === jefeParam)) {
        this.supervisorSeleccionado = jefeParam;
      } else {
        this.supervisorSeleccionado = this.jefesDeCampo.length > 0
          ? this.jefesDeCampo[0].id
          : null;
      }

      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  private _refrescarVista(): void {
    // Tomar el array actualizado del servicio (ya fue modificado por actualizarTrabajador/agregarTrabajador)
    this.jefesDeCampo = this.trabajador.getJefesDeCampo();
    this.trabajadorDetalle = null; // Cerrar panel lateral si estaba abierto
    this.cdr.detectChanges();
  }

  get jefesFiltrados() {
    if (!this.textoBusqueda.trim()) return this.jefesDeCampo;
    const q = this.textoBusqueda.toLowerCase().trim();
    return this.jefesDeCampo.filter(j =>
      j.nombre.toLowerCase().includes(q) || j.zona.toLowerCase().includes(q)
    );
  }

  seleccionarSupervisor(id: string): void {
    this.supervisorSeleccionado = this.supervisorSeleccionado === id ? null : id;
    this.menuActivoId = null;
  }

  toggleMenuAcciones(dni: string, event: Event): void {
    event.stopPropagation();
    this.menuActivoId = this.menuActivoId === dni ? null : dni;
  }

  verDetalleTrabajador(trabajador: any, event: Event): void {
    event.stopPropagation();
    this.trabajadorDetalle = trabajador;
    this.menuActivoId = null;
  }

  cerrarDetalle(): void {
    this.trabajadorDetalle = null;
  }

  irAEditarTrabajador(dni: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/staff/editar_trabajador', dni]);
  }

  irACrearTrabajador(): void {
    this.router.navigate(['/staff/crear_trabajador']);
  }
}