import { useState } from 'react';
import type { MovementFilters } from '../types';

const EMPTY_FILTERS: MovementFilters = { categoryIds: [] };

export function useMovementFilters() {
  const [filters, setFilters] = useState<MovementFilters>(EMPTY_FILTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasActiveFilters = filters.categoryIds.length > 0;

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  // Confirma el filtro elegido en el modal (botón "Filtrar") y lo cierra.
  function applyFilters(categoryIds: string[]) {
    setFilters({ categoryIds });
    setIsModalOpen(false);
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
  }

  return {
    filters,
    hasActiveFilters,
    isModalOpen,
    openModal,
    closeModal,
    applyFilters,
    clearFilters,
  };
}
