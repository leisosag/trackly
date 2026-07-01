import { useState } from 'react';
import { movementsRepository } from '../data/movementsRepository';
import type { Movement } from '../types';

export function useMovements() {
  const [movements, setMovements] = useState<Movement[]>(() =>
    movementsRepository.getAll(),
  );

  function addMovement(movement: Omit<Movement, 'id'>) {
    const created = movementsRepository.create(movement);
    setMovements((prev) => [...prev, created]);
  }

  function updateMovement(id: string, updates: Omit<Movement, 'id'>) {
    const updated = movementsRepository.update(id, updates);
    if (!updated) return;
    setMovements((prev) => prev.map((m) => (m.id === id ? updated : m)));
  }

  function removeMovement(id: string) {
    movementsRepository.remove(id);
    setMovements((prev) => prev.filter((m) => m.id !== id));
  }

  return { movements, addMovement, updateMovement, removeMovement };
}
