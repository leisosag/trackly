import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectedMonthProvider } from './SelectedMonthContext';
import { useSelectedMonth } from './useSelectedMonth';

function TestConsumer() {
  const {
    selectedDate,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    isCurrentMonth,
  } = useSelectedMonth();

  return (
    <div>
      <span data-testid="month">
        {selectedDate.getFullYear()}-{selectedDate.getMonth() + 1}
      </span>
      <span data-testid="is-current">{String(isCurrentMonth)}</span>
      <button onClick={goToPreviousMonth}>Anterior</button>
      <button onClick={goToNextMonth}>Siguiente</button>
      <button onClick={goToCurrentMonth}>Hoy</button>
    </div>
  );
}

describe('SelectedMonthContext', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-07-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('arranca en el primer día del mes actual', () => {
    render(
      <SelectedMonthProvider>
        <TestConsumer />
      </SelectedMonthProvider>,
    );

    expect(screen.getByTestId('month')).toHaveTextContent('2026-7');
    expect(screen.getByTestId('is-current')).toHaveTextContent('true');
  });

  it('retrocede un mes al llamar a goToPreviousMonth', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <SelectedMonthProvider>
        <TestConsumer />
      </SelectedMonthProvider>,
    );

    await user.click(screen.getByText('Anterior'));

    expect(screen.getByTestId('month')).toHaveTextContent('2026-6');
    expect(screen.getByTestId('is-current')).toHaveTextContent('false');
  });

  it('avanza correctamente de diciembre a enero del año siguiente', async () => {
    vi.setSystemTime(new Date('2026-12-15T12:00:00'));
    const user = userEvent.setup({ delay: null });
    render(
      <SelectedMonthProvider>
        <TestConsumer />
      </SelectedMonthProvider>,
    );

    await user.click(screen.getByText('Siguiente'));

    expect(screen.getByTestId('month')).toHaveTextContent('2027-1');
  });

  it('vuelve al mes actual al llamar a goToCurrentMonth después de navegar', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <SelectedMonthProvider>
        <TestConsumer />
      </SelectedMonthProvider>,
    );

    await user.click(screen.getByText('Anterior'));
    await user.click(screen.getByText('Anterior'));
    await user.click(screen.getByText('Hoy'));

    expect(screen.getByTestId('month')).toHaveTextContent('2026-7');
    expect(screen.getByTestId('is-current')).toHaveTextContent('true');
  });

  it('lanza un error si useSelectedMonth se usa fuera del provider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useSelectedMonth debe usarse dentro de un SelectedMonthProvider',
    );

    consoleError.mockRestore();
  });
});
