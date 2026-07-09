import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { creditCardsRepository } from './creditCardsRepository';

describe('creditCardsRepository', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-07-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('devuelve un array vacío cuando no hay tarjetas guardadas', () => {
    expect(creditCardsRepository.getAll()).toEqual([]);
  });

  it('crea una tarjeta y la persiste, con el período actual como closingDayConfirmedPeriod', () => {
    const created = creditCardsRepository.create({
      name: 'Visa',
      closingDay: 10,
      isActive: true,
    });

    expect(created.id).toBeDefined();
    expect(created.closingDayConfirmedPeriod).toBe('2026-07');
    expect(creditCardsRepository.getAll()).toHaveLength(1);
  });

  it('actualiza una tarjeta existente y refresca closingDayConfirmedPeriod', () => {
    const created = creditCardsRepository.create({
      name: 'Visa',
      closingDay: 10,
      isActive: true,
    });

    vi.setSystemTime(new Date('2026-08-02T12:00:00'));

    const updated = creditCardsRepository.update(created.id, {
      name: 'Visa Gold',
      closingDay: 12,
      isActive: true,
    });

    expect(updated?.name).toBe('Visa Gold');
    expect(updated?.closingDayConfirmedPeriod).toBe('2026-08');
  });

  it('permite desactivar una tarjeta mediante update con isActive false', () => {
    const created = creditCardsRepository.create({
      name: 'Visa',
      closingDay: 10,
      isActive: true,
    });

    const updated = creditCardsRepository.update(created.id, {
      name: 'Visa',
      closingDay: 10,
      isActive: false,
    });

    expect(updated?.isActive).toBe(false);
  });

  it('elimina una tarjeta por id', () => {
    const created = creditCardsRepository.create({
      name: 'Visa',
      closingDay: 10,
      isActive: true,
    });

    creditCardsRepository.remove(created.id);

    expect(creditCardsRepository.getAll()).toHaveLength(0);
  });

  it('getAllOrCreateDefault crea la tarjeta por defecto activa si no existe ninguna', () => {
    const result = creditCardsRepository.getAllOrCreateDefault();

    expect(result).toEqual([
      {
        id: 'default-card',
        name: 'Tarjeta principal',
        closingDay: 15,
        isActive: true,
        closingDayConfirmedPeriod: '2026-07',
      },
    ]);
  });

  it('getAllOrCreateDefault no duplica la tarjeta si ya existe una', () => {
    creditCardsRepository.getAllOrCreateDefault();
    const result = creditCardsRepository.getAllOrCreateDefault();

    expect(result).toHaveLength(1);
  });
});
