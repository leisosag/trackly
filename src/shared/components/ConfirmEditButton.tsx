import { useState } from 'react';
import { PencilSimpleIcon } from '@phosphor-icons/react';
import { cn } from '../utils';

interface ConfirmEditButtonProps {
  onConfirm: () => void;
  label?: string;
  confirmLabel?: string;
  iconOnly?: boolean;
  className?: string;
}

export function ConfirmEditButton({
  onConfirm,
  label = 'Editar',
  confirmLabel = 'Editando',
  iconOnly = false,
  className,
}: ConfirmEditButtonProps) {
  const [editing, setEditing] = useState(false);

  function toggleEditing() {
    setEditing((prev) => !prev);
    onConfirm();
  }

  return (
    <button
      type="button"
      aria-label={editing ? confirmLabel : label}
      onClick={toggleEditing}
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium hover:cursor-pointer border',
        editing
          ? 'bg-blue-600 text-white dark:bg-sky-500/15 dark:text-sky-300 dark:border dark:border-sky-400/20'
          : 'hover:bg-blue-600 text-neutral-400 dark:text-white dark:hover:bg-sky-500/15 dark:hover:text-sky-300',
        className,
      )}
    >
      <PencilSimpleIcon size={16} />
      {!iconOnly && (editing ? confirmLabel : label)}
    </button>
  );
}
