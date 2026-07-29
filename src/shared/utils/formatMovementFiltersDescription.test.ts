import { describe, it, expect } from 'vitest';
import { formatMovementFiltersDescription } from './formatMovementFiltersDescription';

describe('formatMovementFiltersDescription', () => {
  it('devuelve categoryLabel con los nombres cuando hay categorías seleccionadas', () => {
    const result = formatMovementFiltersDescription({
      categoryIds: ['food', 'salary'],
      paymentMethodIds: [],
    });

    expect(result.categoryLabel).toBe('Comida, Salario');
  });

  it('devuelve paymentMethodLabel null cuando no hay medios de pago seleccionados', () => {
    const result = formatMovementFiltersDescription({
      categoryIds: ['food'],
      paymentMethodIds: [],
    });

    expect(result.paymentMethodLabel).toBeNull();
  });

  it('devuelve paymentMethodLabel con los nombres cuando hay medios de pago seleccionados', () => {
    const result = formatMovementFiltersDescription({
      categoryIds: [],
      paymentMethodIds: ['debit', 'default-card'],
    });

    expect(result.paymentMethodLabel).toBe('Débito, Tarjeta principal');
  });

  it('devuelve categoryLabel null cuando no hay categorías seleccionadas', () => {
    const result = formatMovementFiltersDescription({
      categoryIds: [],
      paymentMethodIds: ['debit'],
    });

    expect(result.categoryLabel).toBeNull();
  });

  it('trunca la lista de nombres cuando hay más de 3, en cualquiera de las dos dimensiones', () => {
    const result = formatMovementFiltersDescription({
      categoryIds: ['food', 'salary', 'transport', 'home', 'health'],
      paymentMethodIds: [],
    });

    expect(result.categoryLabel).toBe('Comida, Salario, Transporte +2 más');
  });

  it('arma ambas líneas de forma independiente cuando las dos dimensiones están activas', () => {
    const result = formatMovementFiltersDescription({
      categoryIds: ['food'],
      paymentMethodIds: ['debit'],
    });

    expect(result.categoryLabel).toBe('Comida');
    expect(result.paymentMethodLabel).toBe('Débito');
  });
});
