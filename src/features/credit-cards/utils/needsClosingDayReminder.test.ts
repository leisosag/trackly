import { describe, it, expect } from 'vitest';
import { needsClosingDayReminder } from './needsClosingDayReminder';
import type { CreditCard } from '../types';

const referenceDate = new Date('2026-07-15T12:00:00');

describe('needsClosingDayReminder', () => {
  it('no necesita recordatorio si ya fue confirmada en el período actual', () => {
    const card: CreditCard = {
      id: '1',
      name: 'Visa',
      closingDay: 10,
      isActive: true,
      closingDayConfirmedPeriod: '2026-07',
    };

    expect(needsClosingDayReminder(card, referenceDate)).toBe(false);
  });

  it('necesita recordatorio si fue confirmada en un período anterior', () => {
    const card: CreditCard = {
      id: '1',
      name: 'Visa',
      closingDay: 10,
      isActive: true,
      closingDayConfirmedPeriod: '2026-06',
    };

    expect(needsClosingDayReminder(card, referenceDate)).toBe(true);
  });

  it('necesita recordatorio si nunca fue confirmada', () => {
    const card: CreditCard = {
      id: '1',
      name: 'Visa',
      closingDay: 10,
      isActive: true,
    };

    expect(needsClosingDayReminder(card, referenceDate)).toBe(true);
  });

  it('no necesita recordatorio si la tarjeta está desactivada', () => {
    const card: CreditCard = {
      id: '1',
      name: 'Visa',
      closingDay: 10,
      isActive: false,
      closingDayConfirmedPeriod: '2026-06',
    };

    expect(needsClosingDayReminder(card, referenceDate)).toBe(false);
  });
});
