import { paymentMethodsSeed } from './paymentMethodsSeed';
import {
  creditCardsRepository,
  type CreditCard,
} from '@/features/credit-cards';
import type { PaymentMethod } from '../types';

function cardToPaymentMethod(card: CreditCard): PaymentMethod {
  return { id: card.id, name: card.name, kind: 'credit' };
}

// Combina los medios fijos (efectivo, débito) con las tarjetas dinámicas de creditCardsRepository.
export function getPaymentMethods(): PaymentMethod[] {
  const cards = creditCardsRepository.getAllOrCreateDefault();
  return [
    ...paymentMethodsSeed,
    ...cards.filter((c) => c.isActive).map(cardToPaymentMethod),
  ];
}
