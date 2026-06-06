import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Trabajador } from './trabajador';
import { vi } from 'vitest';
import { StaffPage } from './staff.page';

describe('StaffPage', () => {
  let component: StaffPage;
  let fixture: ComponentFixture<StaffPage>;

  beforeEach(async () => {
    const mockSvc: any = {
      getJefesDeCampo: vi.fn().mockReturnValue([])
    };

    await TestBed.configureTestingModule({
      imports: [StaffPage,RouterTestingModule],
      providers: [
        { provide: Trabajador, useValue: mockSvc }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StaffPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

 it('should create', () => {
    expect(component).toBeTruthy();
  });
 afterEach(() => {
  vi.restoreAllMocks(); // restaura console.error después de cada test
});
});
