import { CheckIcon } from '@phosphor-icons/react';
import { cn } from '../utils';

interface ConfirmButtonProps {
  onConfirm: () => void;
  disabled?: boolean;
  className?: string;
}

export function ConfirmButton({
  onConfirm,
  disabled = false,
  className,
}: ConfirmButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onConfirm}
      className={cn(
        'flex items-center justify-center rounded-xl bg-neutral-900 dark:bg-cyan-300 py-3 font-medium text-white dark:text-mauve-900 disabled:bg-neutral-300 dark:disabled:bg-mauve-400 enabled:hover:cursor-pointer',
        className,
      )}
      aria-label="guardar"
    >
      <CheckIcon size={25} />
    </button>
  );
}
