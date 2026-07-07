import { describe, it, expect, beforeEach } from 'vitest';
import { creditCardsRepository } from './creditCardsRepository';

describe('creditCardsRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('devuelve un array vacío cuando no hay tarjetas guardadas', () => {
    expect(creditCardsRepository.getAll()).toEqual([]);
  });

  it('crea una tarjeta y la persiste', () => {
    const created = creditCardsRepository.create({
      name: 'Visa',
      closingDay: 10,
    });

    expect(created.id).toBeDefined();
    expect(creditCardsRepository.getAll()).toHaveLength(1);
  });

  it('actualiza una tarjeta existente', () => {
    const created = creditCardsRepository.create({
      name: 'Visa',
      closingDay: 10,
    });

    const updated = creditCardsRepository.update(created.id, {
      name: 'Visa Gold',
      closingDay: 12,
    });

    expect(updated?.name).toBe('Visa Gold');
  });

  it('elimina una tarjeta por id', () => {
    const created = creditCardsRepository.create({
      name: 'Visa',
      closingDay: 10,
    });

    creditCardsRepository.remove(created.id);

    expect(creditCardsRepository.getAll()).toHaveLength(0);
  });

  it('getAllOrCreateDefault crea la tarjeta por defecto si no existe ninguna', () => {
    const result = creditCardsRepository.getAllOrCreateDefault();

    expect(result).toEqual([
      { id: 'default-card', name: 'Tarjeta principal', closingDay: 15 },
    ]);
  });

  it('getAllOrCreateDefault no duplica la tarjeta si ya existe una', () => {
    creditCardsRepository.getAllOrCreateDefault();
    const result = creditCardsRepository.getAllOrCreateDefault();

    expect(result).toHaveLength(1);
  });
});
