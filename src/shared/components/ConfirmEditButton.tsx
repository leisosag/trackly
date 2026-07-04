import { useState } from 'react';
import { PencilSimpleIcon } from '@phosphor-icons/react';
import { cn } from '../utils';

interface ConfirmEditButtonProps {
  onConfirm: () => void;
}

export function ConfirmEditButton({ onConfirm }: ConfirmEditButtonProps) {
  const [editing, setEditing] = useState(false);

  function toggleEditing() {
    setEditing((prev) => !prev);
    onConfirm();
  }

  return (
    <button
      type="button"
      onClick={toggleEditing}
      className={cn(
        'flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium hover:cursor-pointer',
        editing
          ? 'bg-blue-600 text-white dark:bg-sky-500/15 dark:text-sky-300 dark:border dark:border-sky-400/20'
          : 'hover:bg-blue-600 text-white dark:hover:bg-sky-500/15 dark:hover:text-sky-300',
      )}
    >
      <PencilSimpleIcon size={16} />
      {editing ? 'Editando' : 'Editar'}
    </button>
  );
}
