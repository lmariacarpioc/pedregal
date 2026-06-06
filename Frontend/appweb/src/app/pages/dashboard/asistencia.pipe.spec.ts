import { CountAsistenciaPipe } from './dashboard.page';

describe('CountAsistenciaPipe', () => {
  let pipe: CountAsistenciaPipe;

  beforeEach(() => { pipe = new CountAsistenciaPipe(); });

  const personal = [
    { asistencia: 'PRESENTE' }, { asistencia: 'PRESENTE' },
    { asistencia: 'FALTA' },   { asistencia: 'PRESENTE' }
  ];

  it('debería contar 3 PRESENTE', () => {
    expect(pipe.transform(personal, 'PRESENTE')).toBe(3);
  });

  it('debería contar 1 FALTA', () => {
    expect(pipe.transform(personal, 'FALTA')).toBe(1);
  });
   it('debería devolver 0 si el array está vacío', () => {
    expect(pipe.transform([], 'PRESENTE')).toBe(0);
  });

  it('debería devolver 0 si personal es null o undefined', () => {
    expect(pipe.transform(null as any, 'PRESENTE')).toBe(0);
  });
});