import { useState } from 'react';
import { TrashIcon } from '@phosphor-icons/react';
import { cn } from '../utils';

interface ConfirmDeleteButtonProps {
  onConfirm: () => void;
  label?: string;
  confirmLabel?: string;
  iconOnly?: boolean;
  className?: string;
}

export function ConfirmDeleteButton({
  onConfirm,
  label = 'Eliminar',
  confirmLabel = 'Sí, eliminar',
  iconOnly = false,
  className,
}: ConfirmDeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <button
      type="button"
      aria-label={confirming ? confirmLabel : label}
      onClick={() => (confirming ? onConfirm() : setConfirming(true))}
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium hover:cursor-pointer border',
        confirming
          ? 'bg-red-600 text-white dark:bg-rose-500/15 dark:text-rose-300 dark:border dark:border-rose-400/20'
          : 'text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-400/10',
        className,
      )}
    >
      <TrashIcon size={16} />
      {!iconOnly && (confirming ? confirmLabel : label)}
    </button>
  );
}
