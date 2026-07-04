import type { Budget } from '../types';

const STORAGE_KEY = 'budgets';

function readAll(): Budget[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Budget[];
}

function writeAll(budgets: Budget[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
}

export const budgetsRepository = {
  getAll(): Budget[] {
    return readAll();
  },

  getGeneral(): Budget | undefined {
    return readAll().find((b) => b.isGeneral);
  },

  create(budget: Omit<Budget, 'id'>): Budget {
    const all = readAll();

    if (budget.isGeneral && all.some((b) => b.isGeneral)) {
      throw new Error('Ya existe un presupuesto general');
    }

    const newBudget: Budget = {
      ...budget,
      id: crypto.randomUUID(),
    };
    writeAll([...all, newBudget]);
    return newBudget;
  },

  update(id: string, updates: Omit<Budget, 'id'>): Budget | null {
    const all = readAll();
    const index = all.findIndex((b) => b.id === id);
    if (index === -1) return null;

    const updated: Budget = { ...updates, id };
    const newAll = [...all];
    newAll[index] = updated;
    writeAll(newAll);
    return updated;
  },

  remove(id: string): void {
    const all = readAll();
    writeAll(all.filter((b) => b.id !== id));
  },
};
