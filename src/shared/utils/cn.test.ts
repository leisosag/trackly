import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('combina valores de clases condicionales', () => {
    const optionalClass: string | undefined = undefined;

    expect(cn('base', optionalClass, ['active'])).toBe('base active');
  });

  it('resuelve conflictos entre clases de Tailwind', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });
});
