import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreditCardList } from './CreditCardList';
import type { CreditCard } from '../types';

const cards: CreditCard[] = [
  { id: '1', name: 'Tarjeta principal', closingDay: 15, isActive: true },
  { id: '2', name: 'Visa vieja', closingDay: 5, isActive: false },
];

describe('CreditCardList', () => {
  it('muestra todas las tarjetas con su día de cierre', () => {
    render(<CreditCardList cards={cards} />);

    expect(screen.getByText('Tarjeta principal')).toBeInTheDocument();
    expect(screen.getByText(/Cierre día 15/)).toBeInTheDocument();
  });

  it('marca visualmente las tarjetas desactivadas', () => {
    render(<CreditCardList cards={cards} />);

    expect(screen.getByText(/Cierre día 5 · Desactivada/)).toBeInTheDocument();
  });

  it('llama a onCardClick con la tarjeta tocada', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<CreditCardList cards={cards} onCardClick={handleClick} />);

    await user.click(screen.getByText('Tarjeta principal'));

    expect(handleClick).toHaveBeenCalledWith(cards[0]);
  });

  it('muestra un mensaje cuando no hay tarjetas', () => {
    render(<CreditCardList cards={[]} />);

    expect(screen.getByText('Todavía no creaste tarjetas')).toBeInTheDocument();
  });
});
