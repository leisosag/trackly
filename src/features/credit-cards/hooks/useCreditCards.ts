import { useState } from 'react';
import { creditCardsRepository } from '../data/creditCardsRepository';
import type { CreditCard } from '../types';

export function useCreditCards() {
  const [creditCards, setCreditCards] = useState<CreditCard[]>(() =>
    creditCardsRepository.getAllOrCreateDefault(),
  );

  function addCreditCard(card: Omit<CreditCard, 'id'>) {
    const created = creditCardsRepository.create(card);
    setCreditCards((prev) => [...prev, created]);
  }

  function updateCreditCard(id: string, updates: Omit<CreditCard, 'id'>) {
    const updated = creditCardsRepository.update(id, updates);
    if (!updated) return;
    setCreditCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }

  function removeCreditCard(id: string) {
    creditCardsRepository.remove(id);
    setCreditCards((prev) => prev.filter((c) => c.id !== id));
  }

  return { creditCards, addCreditCard, updateCreditCard, removeCreditCard };
}
