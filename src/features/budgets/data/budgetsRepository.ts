import type { Budget } from '../types';

const STORAGE_KEY = 'budgets';
const MONTHLY_STORAGE_KEY = 'budgetsByMonth';

type MonthlyBudgets = Record<string, Budget[]>;

function readMonthly(): MonthlyBudgets {
  return JSON.parse(localStorage.getItem(MONTHLY_STORAGE_KEY) ?? '{}') as MonthlyBudgets;
}

function readAll(month?: string): Budget[] {
  if (month) {
    const monthly = readMonthly();
    if (Object.hasOwn(monthly, month)) return monthly[month];

    // Cada mes conserva su propia copia. Los datos anteriores siguen como base.
    const previous = Object.keys(monthly).filter((key) => key < month).sort().at(-1);
    const source = previous ? monthly[previous] : readAll();
    const budgets = source.map((budget) => ({ ...budget, id: crypto.randomUUID() }));
    writeAll(budgets, month);
    return budgets;
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Budget[];
}

function writeAll(budgets: Budget[], month?: string): void {
  if (month) {
    localStorage.setItem(MONTHLY_STORAGE_KEY, JSON.stringify({ ...readMonthly(), [month]: budgets }));
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
}

export const budgetsRepository = {
  getAll(month?: string): Budget[] {
    return readAll(month);
  },

  getGeneral(month?: string): Budget | undefined {
    return readAll(month).find((b) => b.isGeneral);
  },

  create(budget: Omit<Budget, 'id'>, month?: string): Budget {
    const all = readAll(month);

    if (budget.isGeneral && all.some((b) => b.isGeneral)) {
      throw new Error('Ya existe un presupuesto general');
    }

    const newBudget: Budget = {
      ...budget,
      id: crypto.randomUUID(),
    };
    writeAll([...all, newBudget], month);
    return newBudget;
  },

  update(id: string, updates: Omit<Budget, 'id'>, month?: string): Budget | null {
    const all = readAll(month);
    const index = all.findIndex((b) => b.id === id);
    if (index === -1) return null;

    const updated: Budget = { ...updates, id };
    const newAll = [...all];
    newAll[index] = updated;
    writeAll(newAll, month);
    return updated;
  },

  remove(id: string, month?: string): void {
    const all = readAll(month);
    writeAll(all.filter((b) => b.id !== id), month);
  },
};
