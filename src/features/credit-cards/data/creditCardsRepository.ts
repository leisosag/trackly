import type { CreditCard } from '../types';

const STORAGE_KEY = 'creditCards';

const DEFAULT_CARD: CreditCard = {
  id: 'default-card',
  name: 'Tarjeta principal',
  closingDay: 15,
};

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

  // Bootstrap: si todavía no existe ninguna tarjeta, crea la tarjeta por defecto con id fijo (no random) para que getPaymentMethods() y el resto de la app
  // puedan depender de un id estable sin necesidad de que la usuaria haya visitado la pantalla de Tarjetas primero
  getAllOrCreateDefault(): CreditCard[] {
    const all = readAll();
    if (all.length > 0) return all;
    writeAll([DEFAULT_CARD]);
    return [DEFAULT_CARD];
  },

  create(card: Omit<CreditCard, 'id'>): CreditCard {
    const newCard: CreditCard = {
      ...card,
      id: crypto.randomUUID(),
    };
    const all = readAll();
    writeAll([...all, newCard]);
    return newCard;
  },

  update(id: string, updates: Omit<CreditCard, 'id'>): CreditCard | null {
    const all = readAll();
    const index = all.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const updated: CreditCard = { ...updates, id };
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
