import { PlusIcon } from '@phosphor-icons/react';

interface FabProps {
  onClick: () => void;
}

export function Fab({ onClick }: FabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Agregar movimiento"
      className="fixed bottom-4 right-4 flex size-14 items-center justify-center rounded-full bg-neutral-900 dark:bg-cyan-300 text-white dark:text-mauve-900 shadow-lg transition-transform hover:scale-105 active:scale-95 hover:cursor-pointer"
    >
      <PlusIcon size={24} weight="bold" />
    </button>
  );
}
