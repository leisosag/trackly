import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('formatea un número entero con símbolo de moneda', () => {
    expect(formatCurrency(1500)).toContain('1.500');
  });

  it('formatea el cero correctamente', () => {
    expect(formatCurrency(0)).toContain('0');
  });
});
