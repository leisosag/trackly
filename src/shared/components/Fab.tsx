import { PlusIcon } from '@phosphor-icons/react';
import { cn } from '../utils';

interface FabProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function Fab({ onClick, label = 'Agregar', className }: FabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'flex size-14 items-center justify-center rounded-full bg-neutral-900 dark:bg-cyan-300 text-white dark:text-mauve-900 shadow-lg transition-transform hover:scale-105 active:scale-95 hover:cursor-pointer',
        className ?? 'fixed bottom-4 right-4',
      )}
    >
      <PlusIcon size={24} weight="bold" />
    </button>
  );
}
