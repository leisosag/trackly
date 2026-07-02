import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('formatea un número entero con símbolo de moneda por defecto', () => {
    expect(formatCurrency(1500, true)).toContain('$');
    expect(formatCurrency(1500)).toContain('1.500');
  });

  it('formatea el cero correctamente', () => {
    expect(formatCurrency(0)).toContain('0');
  });

  it('omite el símbolo de moneda cuando showSymbol es false', () => {
    const result = formatCurrency(1500, false);
    expect(result).not.toContain('$');
    expect(result).toContain('1.500');
  });

  it('no muestra decimales para un monto entero', () => {
    expect(formatCurrency(1500)).not.toContain(',00');
  });
});
