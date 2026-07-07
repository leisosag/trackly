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
// Quien consume esta función (el Select, el formulario) no necesita cambiar nada cuando se agreguen nuevas tarjetas.
export function getPaymentMethods(): PaymentMethod[] {
  const cards = creditCardsRepository.getAllOrCreateDefault();
  return [...paymentMethodsSeed, ...cards.map(cardToPaymentMethod)];
}
