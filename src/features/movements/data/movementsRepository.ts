import type { Movement } from '../types';

const STORAGE_KEY = 'movements';

function readAll(): Movement[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Movement[];
}

function writeAll(movements: Movement[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movements));
}

export const movementsRepository = {
  getAll(): Movement[] {
    return readAll();
  },

  create(movement: Omit<Movement, 'id'>): Movement {
    const newMovement: Movement = {
      ...movement,
      id: crypto.randomUUID(),
    };
    const all = readAll();
    writeAll([...all, newMovement]);
    return newMovement;
  },

  // Usado para generar de una sola vez todas las cuotas de una compra en crédito (ver shared/utils/generateInstallments).
  createMany(movements: Omit<Movement, 'id'>[]): Movement[] {
    const newMovements: Movement[] = movements.map((m) => ({
      ...m,
      id: crypto.randomUUID(),
    }));
    const all = readAll();
    writeAll([...all, ...newMovements]);
    return newMovements;
  },

  update(id: string, updates: Omit<Movement, 'id'>): Movement | null {
    const all = readAll();
    const index = all.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const updated: Movement = { ...updates, id };
    const newAll = [...all];
    newAll[index] = updated;
    writeAll(newAll);
    return updated;
  },

  remove(id: string): void {
    const all = readAll();
    writeAll(all.filter((m) => m.id !== id));
  },
};
