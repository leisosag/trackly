import { PencilSimpleIcon, CreditCardIcon } from '@phosphor-icons/react';
import type { CreditCard } from '../types';

interface CreditCardListProps {
  cards: CreditCard[];
  onCardClick?: (card: CreditCard) => void;
}

export function CreditCardList({ cards, onCardClick }: CreditCardListProps) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-neutral-400">
        <p>Todavía no creaste tarjetas</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {cards.map((card) => (
        <button
          key={card.id}
          type="button"
          onClick={() => onCardClick?.(card)}
          className="flex items-center justify-between rounded-lg bg-neutral-50 dark:bg-mauve-800 px-3 py-2.5 text-left hover:bg-neutral-100 dark:hover:bg-mauve-800/80 hover:cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <CreditCardIcon
              size={18}
              className="shrink-0 text-neutral-400 dark:text-mauve-400"
            />
            <div>
              <p className="font-medium text-neutral-900 dark:text-mauve-50">
                {card.name}
              </p>
              <p className="text-xs text-neutral-400 dark:text-mauve-500">
                Cierre día {card.closingDay}
                {!card.isActive && ' · Desactivada'}
              </p>
            </div>
          </div>
          <PencilSimpleIcon
            size={16}
            className="shrink-0 text-neutral-400 dark:text-mauve-400"
          />
        </button>
      ))}
    </div>
  );
}
