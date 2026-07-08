import type { CreditCard } from '../types';
import { dateToPeriod } from '@/shared/utils';

const STORAGE_KEY = 'creditCards';

function readAll(): CreditCard[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as CreditCard[];
}

function writeAll(cards: CreditCard[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export const creditCardsRepository = {
  getAll(): CreditCard[] {
    return readAll();
  },

  getAllOrCreateDefault(): CreditCard[] {
    const all = readAll();
    if (all.length > 0) return all;
    const defaultCard: CreditCard = {
      id: 'default-card',
      name: 'Tarjeta principal',
      closingDay: 15,
      isActive: true,
      closingDayConfirmedPeriod: dateToPeriod(new Date()),
    };
    writeAll([defaultCard]);
    return [defaultCard];
  },

  create(
    card: Omit<CreditCard, 'id' | 'closingDayConfirmedPeriod'>,
  ): CreditCard {
    const newCard: CreditCard = {
      ...card,
      id: crypto.randomUUID(),
      closingDayConfirmedPeriod: dateToPeriod(new Date()),
    };
    const all = readAll();
    writeAll([...all, newCard]);
    return newCard;
  },

  update(
    id: string,
    updates: Omit<CreditCard, 'id' | 'closingDayConfirmedPeriod'>,
  ): CreditCard | null {
    const all = readAll();
    const index = all.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const updated: CreditCard = {
      ...updates,
      id,
      closingDayConfirmedPeriod: dateToPeriod(new Date()),
    };
    const newAll = [...all];
    newAll[index] = updated;
    writeAll(newAll);
    return updated;
  },

  remove(id: string): void {
    const all = readAll();
    writeAll(all.filter((c) => c.id !== id));
  },
};
