import { describe, it, expect } from 'vitest';
import { formatAmountInput, parseAmountInput } from './amountInput';

describe('formatAmountInput', () => {
  it('agrega separador de miles a un número entero', () => {
    expect(formatAmountInput('50000')).toBe('50.000');
  });

  it('conserva la coma y los centavos', () => {
    expect(formatAmountInput('50000,5')).toBe('50.000,5');
  });

  it('limita los centavos a 2 dígitos', () => {
    expect(formatAmountInput('50000,999')).toBe('50.000,99');
  });

  it('ignora caracteres que no son dígitos ni coma', () => {
    expect(formatAmountInput('50a000b')).toBe('50.000');
  });

  it('elimina ceros a la izquierda sin romper el "0" solo', () => {
    expect(formatAmountInput('0050')).toBe('50');
    expect(formatAmountInput('0')).toBe('0');
  });

  it('devuelve string vacío para un input vacío', () => {
    expect(formatAmountInput('')).toBe('');
  });
});

describe('parseAmountInput', () => {
  it('convierte un monto formateado a number', () => {
    expect(parseAmountInput('50.000')).toBe(50000);
  });

  it('convierte centavos correctamente', () => {
    expect(parseAmountInput('50.000,50')).toBe(50000.5);
  });

  it('devuelve null para un input vacío', () => {
    expect(parseAmountInput('')).toBeNull();
  });

  it('devuelve null si el resultado no es un número finito', () => {
    expect(parseAmountInput(',')).toBeNull();
  });
});
