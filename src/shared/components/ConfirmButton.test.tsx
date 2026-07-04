import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmButton } from './ConfirmButton';

describe('ConfirmButton', () => {
  it('llama a onConfirm al hacer click', async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    render(<ConfirmButton onConfirm={handleConfirm} disabled={false} />);

    await user.click(screen.getByRole('button', { name: 'guardar' }));

    expect(handleConfirm).toHaveBeenCalledOnce();
  });
});
