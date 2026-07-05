import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MonthSelector } from './MonthSelector';
import { SelectedMonthProvider } from '@/shared/context';

describe('MonthSelector', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-07-15T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('muestra el mes y año actuales formateados', () => {
    render(
      <SelectedMonthProvider>
        <MonthSelector />
      </SelectedMonthProvider>,
    );

    expect(screen.getByText('Julio de 2026')).toBeInTheDocument();
  });

  it('el botón "Hoy" está deshabilitado cuando ya se está en el mes actual', () => {
    render(
      <SelectedMonthProvider>
        <MonthSelector />
      </SelectedMonthProvider>,
    );

    expect(screen.getByText('Hoy')).toBeDisabled();
  });

  it('navega al mes anterior y siguiente con las flechas', async () => {
    const user = userEvent.setup();
    render(
      <SelectedMonthProvider>
        <MonthSelector />
      </SelectedMonthProvider>,
    );

    await user.click(screen.getByLabelText('Mes anterior'));
    expect(screen.getByText('Junio de 2026')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Mes siguiente'));
    expect(screen.getByText('Julio de 2026')).toBeInTheDocument();
  });

  it('vuelve al mes actual al tocar "Hoy" después de navegar', async () => {
    const user = userEvent.setup();
    render(
      <SelectedMonthProvider>
        <MonthSelector />
      </SelectedMonthProvider>,
    );

    await user.click(screen.getByLabelText('Mes anterior'));
    expect(screen.getByText('Hoy')).toBeEnabled();

    await user.click(screen.getByText('Hoy'));

    expect(screen.getByText('Julio de 2026')).toBeInTheDocument();
    expect(screen.getByText('Hoy')).toBeDisabled();
  });
});
