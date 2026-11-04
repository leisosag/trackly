import { useState } from 'react';
import { budgetsRepository } from '../data/budgetsRepository';
import type { Budget } from '../types';
import { useSelectedMonth } from '@/shared/context';
import { dateToPeriod } from '@/shared/utils/statementPeriod';

function loadInitialBudgets(month: string): Budget[] {
  const all = budgetsRepository.getAll(month);
  if (all.some((b) => b.isGeneral)) return all;

  const general = budgetsRepository.create({
    name: 'Presupuesto general',
    amount: 0,
    period: 'monthly',
    categoryIds: null,
    isGeneral: true,
  }, month);

  return [...all, general];
}

export function useBudgets() {
  const { selectedDate } = useSelectedMonth();
  const month = dateToPeriod(selectedDate);
  const [state, setState] = useState(() => ({ month, budgets: loadInitialBudgets(month) }));
  if (state.month !== month) {
    setState({ month, budgets: loadInitialBudgets(month) });
  }
  const budgets = state.month === month ? state.budgets : loadInitialBudgets(month);

  function setBudgets(update: (previous: Budget[]) => Budget[]) {
    setState((previous) => ({ month, budgets: update(previous.budgets) }));
  }

  function addBudget(budget: Omit<Budget, 'id'>) {
    const created = budgetsRepository.create(budget, month);
    setBudgets((prev) => [...prev, created]);
  }

  function updateBudget(id: string, updates: Omit<Budget, 'id'>) {
    const updated = budgetsRepository.update(id, updates, month);
    if (!updated) return;
    setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)));
  }

  function removeBudget(id: string) {
    budgetsRepository.remove(id, month);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }

  return { budgets, addBudget, updateBudget, removeBudget };
}
