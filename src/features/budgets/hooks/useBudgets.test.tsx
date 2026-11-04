import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { SelectedMonthProvider, useSelectedMonth } from '@/shared/context';
import { useBudgets } from './useBudgets';
import type { Budget } from '../types';

describe('useBudgets', () => {
  beforeEach(() => localStorage.clear());

  it('mantiene los importes de cada mes al navegar y volver a abrir la pantalla', () => {
    const food: Omit<Budget, 'id'> = {
      name: 'Comida', amount: 100000, period: 'monthly',
      categoryIds: ['food'], isGeneral: false,
    };
    const useMonthlyBudgets = () => ({ ...useBudgets(), ...useSelectedMonth() });
    const { result, unmount } = renderHook(useMonthlyBudgets, { wrapper: SelectedMonthProvider });
    act(() => result.current.addBudget(food));
    act(() => result.current.goToNextMonth());
    const copied = result.current.budgets.find((b) => !b.isGeneral)!;
    expect(copied.amount).toBe(100000);
    act(() => result.current.updateBudget(copied.id, { ...food, amount: 120000 }));
    act(() => result.current.goToPreviousMonth());
    expect(result.current.budgets.find((b) => !b.isGeneral)?.amount).toBe(100000);
    act(() => result.current.goToNextMonth());
    expect(result.current.budgets.find((b) => !b.isGeneral)?.amount).toBe(120000);
    unmount();

    const reopened = renderHook(useMonthlyBudgets, { wrapper: SelectedMonthProvider });
    expect(reopened.result.current.budgets.find((b) => !b.isGeneral)?.amount).toBe(100000);
    act(() => reopened.result.current.goToNextMonth());
    expect(reopened.result.current.budgets.find((b) => !b.isGeneral)?.amount).toBe(120000);
  });
});
