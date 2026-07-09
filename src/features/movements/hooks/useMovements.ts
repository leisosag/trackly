import { useState } from 'react';
import { movementsRepository } from '../data/movementsRepository';
import type { Movement, NewMovementInput } from '../types';
import { getPaymentMethodById } from '@/features/payment-methods';
import { creditCardsRepository } from '@/features/credit-cards';
import { generateInstallments } from '@/shared/utils';

export function useMovements() {
  const [movements, setMovements] = useState<Movement[]>(() =>
    movementsRepository.getAll(),
  );

  function addMovement(input: NewMovementInput) {
    const { installmentsCount, ...movement } = input;
    const paymentMethod = movement.paymentMethodId
      ? getPaymentMethodById(movement.paymentMethodId)
      : undefined;

    // Los movimientos con medio de pago crédito necesitan statementPeriod
    // y, si hay más de una cuota, expandirse en varios movimientos antes de persistirse
    // ver shared/utils/generateInstallments.
    if (paymentMethod?.kind === 'credit') {
      const card = creditCardsRepository
        .getAllOrCreateDefault()
        .find((c) => c.id === paymentMethod.id);

      const toCreate = generateInstallments(
        movement,
        installmentsCount ?? 1,
        card?.closingDay ?? 15,
      );
      const created = movementsRepository.createMany(toCreate);
      setMovements((prev) => [...prev, ...created]);
      return;
    }

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
