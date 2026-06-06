import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Trabajador } from './trabajador';

describe('Trabajador (servicio)', () => {
  let svc: Trabajador;

  beforeEach(() => {
    // Limpiamos localStorage antes de cada test
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        Trabajador,
        provideHttpClient(),
        provideHttpClientTesting() // mock de HttpClient, no hace llamadas reales
      ]
    });
    svc = TestBed.inject(Trabajador);
      });
  it('debería cargar los jefes iniciales si localStorage está vacío', () => {
    const jefes = svc.getJefesDeCampo();
    expect(jefes.length).toBe(3);
    expect(jefes[0].nombre).toBe('Brígida Torres');
  });
  it('debería agregar un nuevo jefe de campo', () => {
    svc.agregarJefeCampo({
      id: 'SUP-099', nombre: 'Test Jefe', rol: 'Jefe',
      zona: 'Lote 99', totalACargo: 0, avatar: 'TJ', trabajadores: []
    });
    expect(svc.getJefesDeCampo().length).toBe(4);
  });

  it('debería calcular rendimiento de trabajador al actualizar', () => {
    const t = svc.obtenerTrabajadorPorDni('45678912')!;
    t.cajas = 10; t.metaBase = 10;
    svc.actualizarTrabajador(t);
    const actualizado = svc.obtenerTrabajadorPorDni('45678912')!;
    expect(actualizado.rendimiento).toBe(100);
    expect(actualizado.estado).toBe('Óptimo');
  });
it('debería asignar estado Crítico si rendimiento < 70', () => {
    const t = svc.obtenerTrabajadorPorDni('45678912')!;
    t.cajas = 5; t.metaBase = 10;
    svc.actualizarTrabajador(t);
    expect(svc.obtenerTrabajadorPorDni('45678912')!.estado).toBe('Crítico');
  });

  it('debería persistir un parte finalizado y actualizar producción', () => {
    svc.guardarParte({
      id: 'P-001', fecha: '01/01/2024', jefeId: 'SUP-001',
      jefeNombre: 'Brígida Torres', campana: '2024',
      cultivo: 'Uva', fundo: 'Yaurilla', lote: 'L12',
      labor: 'Cosecha', produccionAvanzada: 500, metaDiaria: 1000,
      personal: [], registrosProduccion: [], estado: 'finalizado'
    });
    expect(svc.getTotalProduccion()).toBe(500);
    expect(svc.getPorcentajeAvanceCosecha()).toBe(50);
  });
   it('debería devolver null si el DNI no existe', () => {
    expect(svc.obtenerTrabajadorPorDni('99999999')).toBeNull();
  });
});