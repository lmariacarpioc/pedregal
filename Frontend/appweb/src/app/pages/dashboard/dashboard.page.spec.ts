import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardPage } from './dashboard.page';
import { Trabajador } from '../staff/trabajador';
import { vi } from 'vitest';

describe('DashboardPage', () => {
  let mockSvc: Partial<Trabajador>;
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(async () => {
    mockSvc = {
      getTotalPersonalActivo:       vi.fn().mockReturnValue(30),
      getPorcentajeAvanceCosecha:   vi.fn().mockReturnValue(65),
      getCostoImproductividad:      vi.fn().mockReturnValue(200),
      getRankingGrupos:             vi.fn().mockReturnValue([]),
      getPartesFinalizados:         vi.fn().mockReturnValue([]),
      getJefesDeCampo:              vi.fn().mockReturnValue([]),
      getTotalProduccion:           vi.fn().mockReturnValue(0),
      getMetaTotalProduccion:       vi.fn().mockReturnValue(2450),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardPage, RouterTestingModule],
      providers: [{ provide: Trabajador, useValue: mockSvc }]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar personalActivo desde el servicio en ngOnInit', () => {
    expect(component.personalActivo).toBe(30);
  });

  it('debería calcular totalInasistencias como 0 si no hay partes', () => {
    expect(component.totalInasistencias).toBe(0);
  });

  it('debería filtrar grupos por textoBusqueda', () => {
    component.grupos = [
      { nombre: 'Cuadrilla A', lider: 'Brígida Torres', rendimiento: 75 },
      { nombre: 'Cuadrilla B', lider: 'Elias Navarro',  rendimiento: 80 }
    ];
    component.textoBusqueda = 'brígida';
    expect(component.gruposFiltrados.length).toBe(1);
  });

  it('debería alternar alertasVisible y cerrar reporteVisible', () => {
    component.reporteVisible = true;
    component.toggleAlertas();
    expect(component.alertasVisible).toBe(true);
    expect(component.reporteVisible).toBe(false);
  });
});