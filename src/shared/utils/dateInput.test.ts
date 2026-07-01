import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDateLabel,
  isoToInputValue,
  applyDateToIso,
  getTodayInputValue,
} from './dateInput';

describe('dateInput utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-01T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('formatDateLabel devuelve "Hoy" para la fecha actual', () => {
    expect(formatDateLabel(getTodayInputValue())).toBe('Hoy');
  });

  it('formatDateLabel devuelve dd/mm/aaaa para otra fecha', () => {
    expect(formatDateLabel('2026-07-20')).toBe('20/07/2026');
  });

  it('isoToInputValue extrae la fecha en formato yyyy-mm-dd', () => {
    expect(isoToInputValue('2026-07-20T16:40:00.000Z')).toBe('2026-07-20');
  });

  it('applyDateToIso cambia el día pero conserva la hora original', () => {
    const original = '2026-07-01T16:40:00.000Z';
    const result = applyDateToIso(original, '2026-07-20');

    const resultDate = new Date(result);
    expect(resultDate.getDate()).toBe(20);
    expect(resultDate.getHours()).toBe(new Date(original).getHours());
    expect(resultDate.getMinutes()).toBe(new Date(original).getMinutes());
  });
});
