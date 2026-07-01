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

  return { movements, addMovement };
}
