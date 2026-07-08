import type { Movement } from '@/features/movements';
import type { CreditCard } from '@/features/credit-cards';

export interface CardMovementGroup {
  card: CreditCard;
  movements: Movement[];
  total: number;
}

export function groupMovementsByCard(
  movements: Movement[],
  cards: CreditCard[],
): CardMovementGroup[] {
  return cards.map((card) => {
    const cardMovements = movements.filter(
      (m) => m.paymentMethodId === card.id,
    );
    return {
      card,
      movements: cardMovements,
      total: cardMovements.reduce((sum, m) => sum + m.amount, 0),
    };
  });
}
