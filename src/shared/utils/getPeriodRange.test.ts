import { describe, it, expect } from 'vitest';
import { getPeriodRange } from './getPeriodRange';

describe('getPeriodRange', () => {
  it('devuelve el primer y último día del mes para período mensual', () => {
    const { start, end } = getPeriodRange(
      'monthly',
      new Date('2026-07-15T12:00:00'),
    );

    expect(start.getDate()).toBe(1);
    expect(start.getMonth()).toBe(6); // julio
    expect(end.getDate()).toBe(31);
    expect(end.getHours()).toBe(23);
  });
});
