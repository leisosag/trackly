import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreditCardsPage } from './CreditCardsPage';
import { SelectedMonthProvider } from '@/shared/context';

function seedMovements() {
  localStorage.setItem(
    'movements',
    JSON.stringify([
      {
        id: '1',
        categoryId: 'food',
        amount: 100,
        date: '2026-07-05T10:00:00.000Z',
        paymentMethodId: 'default-card',
        statementPeriod: '2026-07',
        installment: { groupId: 'g1', number: 1, total: 1 },
      },
      {
        id: '2',
        categoryId: 'food',
        amount: 200,
        date: '2026-07-06T10:00:00.000Z',
        paymentMethodId: 'debit',
      },
      {
        id: '3',
        categoryId: 'transport',
        amount: 300,
        date: '2026-06-20T10:00:00.000Z',
        paymentMethodId: 'default-card',
        statementPeriod: '2026-08',
      },
    ]),
  );
}

describe('CreditCardsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-07-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('muestra los movimientos de crédito del período seleccionado y su total', () => {
    seedMovements();

    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    expect(screen.getByText('Comida')).toBeInTheDocument();
    expect(screen.getByTestId('credit-cards-total')).toHaveTextContent('100'); // total del header
    expect(screen.getByText(/-100/)).toBeInTheDocument(); // importe del movimiento
  });

  it('excluye movimientos que no son de tarjeta de crédito aunque sean del mismo mes', () => {
    seedMovements();

    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    expect(screen.queryByText('200')).not.toBeInTheDocument();
  });

  it('excluye movimientos de crédito de otro statementPeriod', () => {
    seedMovements();

    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    expect(screen.queryByText('Transporte')).not.toBeInTheDocument();
  });

  it('muestra el estado vacío cuando no hay movimientos de crédito en el período', () => {
    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    expect(
      screen.getByText('Todavía no cargaste movimientos en este período'),
    ).toBeInTheDocument();
  });

  it('muestra el período formateado en el encabezado', () => {
    seedMovements();

    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    expect(screen.getByText(/Julio de 2026/)).toBeInTheDocument();
  });

  it('agrupa los movimientos por tarjeta, mostrando el nombre de cada una como encabezado', () => {
    seedMovements();

    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    // el encabezado de grupo es un <h4>, no un botón: no choca con
    // CreditCardList porque el modal de gestión ni siquiera está abierto acá
    expect(
      screen.getByRole('heading', { name: 'Tarjeta principal' }),
    ).toBeInTheDocument();
  });

  it('abre el modal de gestión de tarjetas al tocar el ícono de ajustes', async () => {
    const user = userEvent.setup();

    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    await user.click(
      screen.getByRole('button', { name: /gestionar tarjetas/i }),
    );

    // dentro del modal, la tarjeta se lista como botón (CreditCardList);
    // el <h4> de agrupación del main también dice "Tarjeta principal", por
    // eso se apunta puntualmente al rol "button" para desambiguar
    expect(
      screen.getByRole('button', { name: /tarjeta principal/i }),
    ).toBeInTheDocument();
  });

  it('permite crear una nueva tarjeta desde el modal de gestión', async () => {
    const user = userEvent.setup();

    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    await user.click(
      screen.getByRole('button', { name: /gestionar tarjetas/i }),
    );
    await user.click(screen.getByRole('button', { name: /agregar tarjeta/i }));

    await user.type(screen.getByLabelText(/nombre de la tarjeta/i), 'Visa');
    await user.type(screen.getByLabelText(/día de cierre/i), '10');
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    // apenas se crea, el main también arma un grupo "Visa" (0 movimientos),
    // así que se apunta al botón de CreditCardList, no a getByText
    expect(screen.getByRole('button', { name: /visa/i })).toBeInTheDocument();
  });

  it('permite editar el nombre de la tarjeta principal', async () => {
    const user = userEvent.setup();

    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    await user.click(
      screen.getByRole('button', { name: /gestionar tarjetas/i }),
    );
    await user.click(
      screen.getByRole('button', { name: /tarjeta principal/i }),
    );
    await user.click(screen.getByRole('button', { name: /editar/i }));

    const nameInput = screen.getByLabelText(/nombre de la tarjeta/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Mi Visa');
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    // después de guardar, el modal de edición se cierra pero el de gestión
    // sigue abierto, y el main también actualiza su <h4> a "Mi Visa" — por
    // eso se apunta al botón de la lista, no a getByText
    expect(
      screen.getByRole('button', { name: /mi visa/i }),
    ).toBeInTheDocument();
  });

  it('permite reactivar una tarjeta desactivada desde el modal de gestión', async () => {
    const user = userEvent.setup();

    render(
      <SelectedMonthProvider>
        <CreditCardsPage />
      </SelectedMonthProvider>,
    );

    // crear y luego desactivar una tarjeta nueva
    await user.click(
      screen.getByRole('button', { name: /gestionar tarjetas/i }),
    );
    await user.click(screen.getByRole('button', { name: /agregar tarjeta/i }));
    await user.type(screen.getByLabelText(/nombre de la tarjeta/i), 'Visa');
    await user.type(screen.getByLabelText(/día de cierre/i), '10');
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    await user.click(screen.getByRole('button', { name: /visa/i }));
    await user.click(screen.getByRole('button', { name: /desactivar/i }));
    await user.click(screen.getByRole('button', { name: /Sí, desactivar/i }));

    // desactivada: ya no forma parte de activeCards, así que desaparece del
    // grupo del main y "Visa" vuelve a ser único en pantalla
    await user.click(screen.getByRole('button', { name: /visa/i }));
    await user.click(screen.getByRole('button', { name: /activar/i }));
    await user.click(screen.getByRole('button', { name: /Sí, activar/i }));

    expect(screen.getByText(/Cierre día 10/)).not.toHaveTextContent(
      'Desactivada',
    );
  });
});
