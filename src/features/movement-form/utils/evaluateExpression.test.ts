import { describe, it, expect } from 'vitest';
import { evaluateExpression } from './evaluateExpression';

describe('evaluateExpression', () => {
  it('evalúa un número simple', () => {
    expect(evaluateExpression('150')).toBe(150);
  });

  it('resuelve una suma', () => {
    expect(evaluateExpression('100+50')).toBe(150);
  });

  it('resuelve una resta', () => {
    expect(evaluateExpression('200-50')).toBe(150);
  });

  it('respeta la precedencia de la multiplicación sobre la suma', () => {
    expect(evaluateExpression('10+5*2')).toBe(20); // no 30
  });

  it('respeta la precedencia de la división sobre la resta', () => {
    expect(evaluateExpression('100-20/2')).toBe(90); // no 40
  });

  it('resuelve varias operaciones combinadas', () => {
    expect(evaluateExpression('10+2*3-4/2')).toBe(14); // 10+6-2
  });

  it('ignora espacios en la expresión', () => {
    expect(evaluateExpression('100 + 50')).toBe(150);
  });

  it('devuelve null para un string vacío', () => {
    expect(evaluateExpression('')).toBeNull();
  });

  it('devuelve null para una expresión que termina en operador', () => {
    expect(evaluateExpression('100+')).toBeNull();
  });

  it('devuelve null para una división por cero', () => {
    expect(evaluateExpression('100/0')).toBeNull();
  });
});
