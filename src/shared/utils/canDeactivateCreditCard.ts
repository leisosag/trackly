import type { Movement } from '@/features/movements';
import { dateToPeriod } from './statementPeriod';

export function canDeactivateCreditCard(
  cardId: string,
  movements: Movement[],
  referenceDate: Date = new Date(),
): boolean {
  const currentPeriod = dateToPeriod(referenceDate);
  return !movements.some(
    (m) =>
      m.paymentMethodId === cardId &&
      m.statementPeriod !== undefined &&
      m.statementPeriod >= currentPeriod,
  );
}
