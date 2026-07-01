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
};
