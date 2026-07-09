import { creditCardsRepository } from './creditCardsRepository';
import type { CreditCard } from '../types';

export function getCreditCardById(id: string): CreditCard | undefined {
  return creditCardsRepository.getAllOrCreateDefault().find((c) => c.id === id);
}
