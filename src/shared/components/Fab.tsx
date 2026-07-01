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
      className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 hover:cursor-pointer"
    >
      <PlusIcon size={24} weight="bold" />
    </button>
  );
}
