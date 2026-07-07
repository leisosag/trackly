import { describe, it, expect } from 'vitest';
import {
  getStatementPeriod,
  addPeriodMonths,
  formatPeriodLabel,
} from './statementPeriod';

describe('getStatementPeriod', () => {
  it('incluye la compra en el resumen del mes actual si es el día de cierre o antes', () => {
    expect(getStatementPeriod(new Date('2026-07-05T10:00:00'), 15)).toBe(
      '2026-07',
    );
    expect(getStatementPeriod(new Date('2026-07-15T10:00:00'), 15)).toBe(
      '2026-07',
    );
  });

  it('incluye la compra en el resumen del mes siguiente si es después del cierre', () => {
    expect(getStatementPeriod(new Date('2026-07-22T10:00:00'), 15)).toBe(
      '2026-08',
    );
  });

  it('pasa correctamente de diciembre a enero del año siguiente', () => {
    expect(getStatementPeriod(new Date('2026-12-20T10:00:00'), 15)).toBe(
      '2027-01',
    );
  });
});

describe('addPeriodMonths', () => {
  it('suma meses a un período dado', () => {
    expect(addPeriodMonths('2026-07', 1)).toBe('2026-08');
    expect(addPeriodMonths('2026-07', 2)).toBe('2026-09');
  });

  it('pasa correctamente de diciembre a enero del año siguiente', () => {
    expect(addPeriodMonths('2026-12', 1)).toBe('2027-01');
  });

  it('con amount 0 devuelve el mismo período', () => {
    expect(addPeriodMonths('2026-07', 0)).toBe('2026-07');
  });
});

describe('formatPeriodLabel', () => {
  it('formatea un período como mes y año en español, con mayúscula inicial', () => {
    expect(formatPeriodLabel('2026-08')).toBe('Agosto de 2026');
  });

  it('formatea correctamente el mes de enero', () => {
    expect(formatPeriodLabel('2027-01')).toBe('Enero de 2027');
  });
});
