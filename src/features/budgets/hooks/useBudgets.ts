import { useState } from 'react';
import { budgetsRepository } from '../data/budgetsRepository';
import type { Budget } from '../types';

function loadInitialBudgets(): Budget[] {
  const all = budgetsRepository.getAll();
  if (all.some((b) => b.isGeneral)) return all;

  const general = budgetsRepository.create({
    name: 'Presupuesto general',
    amount: 0,
    period: 'monthly',
    categoryIds: null,
    isGeneral: true,
  });

  return [...all, general];
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>(loadInitialBudgets);

  function addBudget(budget: Omit<Budget, 'id'>) {
    const created = budgetsRepository.create(budget);
    setBudgets((prev) => [...prev, created]);
  }

  function updateBudget(id: string, updates: Omit<Budget, 'id'>) {
    const updated = budgetsRepository.update(id, updates);
    if (!updated) return;
    setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)));
  }

  function removeBudget(id: string) {
    budgetsRepository.remove(id);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }

  return { budgets, addBudget, updateBudget, removeBudget };
}
