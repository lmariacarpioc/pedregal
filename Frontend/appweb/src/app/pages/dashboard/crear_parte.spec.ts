import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Crear_Parte } from './crear_parte';
import { Trabajador, IJefeCampo } from '../staff/trabajador';
import { vi } from 'vitest';

describe('Crear_Parte', () => {
  let mockSvc: Partial<Trabajador>;
  let component: Crear_Parte;
  let fixture: ComponentFixture<Crear_Parte>;

  const jefeFalso: IJefeCampo = {
    id: 'SUP-001', nombre: 'Test Jefe', rol: 'Jefe de Campo',
    zona: 'Lote 01', totalACargo: 0, avatar: 'TJ', trabajadores: []
  };

  beforeEach(async () => {
    // En Vitest usamos vi.fn() en lugar de jasmine.createSpyObj
    mockSvc = {
      getJefesDeCampo:        vi.fn().mockReturnValue([jefeFalso]),
      generarIdJefe:          vi.fn().mockReturnValue('SUP-099'),
      agregarJefeCampo:       vi.fn(),
      agregarTrabajadorAJefe: vi.fn(),
      guardarParte:           vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Crear_Parte, RouterTestingModule],
      providers: [{ provide: Trabajador, useValue: mockSvc }]
    }).compileComponents();

    fixture = TestBed.createComponent(Crear_Parte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería arrancar en paso 0', () => {
    expect(component.pasoActual).toBe(0);
    expect(component.jefeSeleccionado).toBeNull();
  });

  it('debería avanzar al paso 1 al seleccionar un jefe', () => {
    component.seleccionarJefe(jefeFalso);
    expect(component.pasoActual).toBe(1);
    expect(component.jefeSeleccionado).toEqual(jefeFalso);
  });

  it('no debería avanzar más allá del paso 4', () => {
    component.pasoActual = 4;
    component.siguientePaso();
    expect(component.pasoActual).toBe(4);
  });

  it('debería rechazar trabajador con DNI duplicado', () => {
    component.personal = [{ dni: '12345678', nombre: 'Alguien' }];
    component.nuevoTrabajador.nombre = 'Nuevo';
    component.nuevoTrabajador.dni = '12345678';
    component.confirmarNuevoTrabajador();
    expect(component.errorNuevoTrabajador).toContain('Ya existe un trabajador');
    expect(component.personal.length).toBe(1);
  });

  it('debería rechazar DNI con menos de 8 dígitos', () => {
    component.nuevoTrabajador.nombre = 'Juan';
    component.nuevoTrabajador.dni = '1234';
    component.confirmarNuevoTrabajador();
    expect(component.errorNuevoTrabajador).toContain('DNI válido');
  });

  it('volver a paso 0 debería limpiar jefeSeleccionado', () => {
    component.pasoActual = 2;
    component.jefeSeleccionado = { id: 'X' } as any;
    component.irAPaso(0);
    expect(component.jefeSeleccionado).toBeNull();
  });
});