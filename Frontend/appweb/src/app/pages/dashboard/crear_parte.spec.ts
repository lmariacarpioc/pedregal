import { ComponentFixture, TestBed } from '@angular/core/testing';
import{Crear_Parte} from './crear_parte';
describe('Crear_Parte', () => {
  let component: Crear_Parte;
  let fixture: ComponentFixture<Crear_Parte>;
    beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Crear_Parte],
    }).compileComponents();
    fixture = TestBed.createComponent(Crear_Parte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});