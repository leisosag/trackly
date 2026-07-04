import { useState } from 'react';
import { TrashIcon } from '@phosphor-icons/react';
import { cn } from '../utils';

interface ConfirmDeleteButtonProps {
  onConfirm: () => void;
  label?: string;
  confirmLabel?: string;
}

export function ConfirmDeleteButton({
  onConfirm,
  label = 'Eliminar',
  confirmLabel = 'Sí, eliminar',
}: ConfirmDeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <button
      type="button"
      onClick={() => (confirming ? onConfirm() : setConfirming(true))}
      className={cn(
        'flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium hover:cursor-pointer',
        confirming
          ? 'bg-red-600 text-white dark:bg-rose-500/15 dark:text-rose-300 dark:border dark:border-rose-400/20'
          : 'text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-400/10',
      )}
    >
      <TrashIcon size={16} />
      {confirming ? confirmLabel : label}
    </button>
  );
}
