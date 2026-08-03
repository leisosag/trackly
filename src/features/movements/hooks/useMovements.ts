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

  // Edita la cuota raíz (number === 1) de una compra en cuotas: regenera
  // TODAS las cuotas del grupo con los nuevos datos, conservando groupId,
  // cantidad de cuotas y medio de pago (no editables desde acá). Único
  // punto de entrada para modificar una compra en crédito ya cargada.
  function updateInstallmentGroup(
    groupId: string,
    updates: {
      categoryId: string;
      description?: string;
      amount: number;
      date: string;
      paymentMethodId: string;
    },
  ) {
    const group = movements.filter((m) => m.installment?.groupId === groupId);
    if (group.length === 0) return;

    const installmentsCount = group[0].installment!.total;
    const card = creditCardsRepository
      .getAllOrCreateDefault()
      .find((c) => c.id === updates.paymentMethodId);

    const regenerated = generateInstallments(
      updates,
      installmentsCount,
      card?.closingDay ?? 15,
      groupId,
    );

    const oldIds = group.map((m) => m.id);
    movementsRepository.removeMany(oldIds);
    const created = movementsRepository.createMany(regenerated);

    setMovements((prev) => [
      ...prev.filter((m) => m.installment?.groupId !== groupId),
      ...created,
    ]);
  }

  // Elimina todas las cuotas de una compra (solo se dispara desde la cuota raíz).
  function removeInstallmentGroup(groupId: string) {
    const oldIds = movements
      .filter((m) => m.installment?.groupId === groupId)
      .map((m) => m.id);

    movementsRepository.removeMany(oldIds);
    setMovements((prev) =>
      prev.filter((m) => m.installment?.groupId !== groupId),
    );
  }

  return {
    movements,
    addMovement,
    updateMovement,
    removeMovement,
    updateInstallmentGroup,
    removeInstallmentGroup,
  };
}
