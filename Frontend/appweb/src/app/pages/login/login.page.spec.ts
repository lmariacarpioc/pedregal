import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage,RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('debería renderizar el título EL PEDREGAL', () => {
    const h2: HTMLElement = fixture.nativeElement.querySelector('.login-header h2');
    expect(h2.textContent).toContain('EL PEDREGAL');
  });

  it('debería tener un campo de email y uno de contraseña', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
    expect(inputs[0].type).toBe('email');
    expect(inputs[1].type).toBe('password');
  });
});