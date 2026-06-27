import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Reportes } from './reportes';
import { Trabajador } from '../staff/trabajador'; // Asegúrate de verificar la ruta de tu servicio

describe('Reportes', () => {
  let component: Reportes;
  let fixture: ComponentFixture<Reportes>;
  let trabajadorMock: any;

  beforeEach(async () => {
    // Simulador nativo del servicio Trabajador para evitar depender del objeto Jasmine global
    trabajadorMock = {
      sincronizarConBackend: () => Promise.resolve(),
      getJefesDeCampo: () => [],
      getRankingGrupos: () => []
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Modulo oficial de pruebas para simular peticiones HTTP de forma segura
        Reportes
      ],
      providers: [
        // Inyectamos el mock en lugar de la clase real
        { provide: Trabajador, useValue: trabajadorMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Reportes);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara el ciclo de vida inicial ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});