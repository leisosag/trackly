import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMovementFilters } from './useMovementFilters';

describe('useMovementFilters', () => {
  it('arranca sin filtros activos y con el modal cerrado', () => {
    const { result } = renderHook(() => useMovementFilters());

    expect(result.current.filters.categoryIds).toEqual([]);
    expect(result.current.filters.paymentMethodIds).toEqual([]);
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.isModalOpen).toBe(false);
  });

  it('openModal y closeModal controlan el modal sin afectar el filtro', () => {
    const { result } = renderHook(() => useMovementFilters());

    act(() => result.current.openModal());
    expect(result.current.isModalOpen).toBe(true);

    act(() => result.current.closeModal());
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.filters.categoryIds).toEqual([]);
  });

  it('applyFilters aplica categorías y medios de pago, y cierra el modal', () => {
    const { result } = renderHook(() => useMovementFilters());

    act(() => result.current.openModal());
    act(() => result.current.applyFilters(['food', 'salary'], ['debit']));

    expect(result.current.filters.categoryIds).toEqual(['food', 'salary']);
    expect(result.current.filters.paymentMethodIds).toEqual(['debit']);
    expect(result.current.isModalOpen).toBe(false);
  });

  it('hasActiveFilters es true si hay categorías, aunque no haya medios de pago', () => {
    const { result } = renderHook(() => useMovementFilters());

    act(() => result.current.applyFilters(['food'], []));

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('hasActiveFilters es true si hay medios de pago, aunque no haya categorías', () => {
    const { result } = renderHook(() => useMovementFilters());

    act(() => result.current.applyFilters([], ['debit']));

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('applyFilters con ambos arrays vacíos deja hasActiveFilters en false', () => {
    const { result } = renderHook(() => useMovementFilters());

    act(() => result.current.applyFilters(['food'], ['debit']));
    act(() => result.current.applyFilters([], []));

    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('clearFilters vuelve al estado inicial sin categorías ni medios de pago', () => {
    const { result } = renderHook(() => useMovementFilters());

    act(() => result.current.applyFilters(['food', 'transport'], ['debit']));
    act(() => result.current.clearFilters());

    expect(result.current.filters.categoryIds).toEqual([]);
    expect(result.current.filters.paymentMethodIds).toEqual([]);
    expect(result.current.hasActiveFilters).toBe(false);
  });
});
