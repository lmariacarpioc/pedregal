import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EditarTrabajador } from './editar_trabajador';
import { Trabajador } from './trabajador';
import { vi } from 'vitest';

describe('EditarTrabajador', () => {
  let component: EditarTrabajador;
  let fixture: ComponentFixture<EditarTrabajador>;

  beforeEach(async () => {
    const mockSvc = {
      obtenerTrabajadorPorDni: vi.fn().mockReturnValue(null),
      actualizarTrabajador:    vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [EditarTrabajador, RouterTestingModule],
      providers: [{ provide: Trabajador, useValue: mockSvc }]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarTrabajador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});