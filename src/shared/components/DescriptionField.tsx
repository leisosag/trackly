import { PencilSimpleIcon } from '@phosphor-icons/react';

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function DescriptionField({
  value,
  onChange,
  disabled = false,
}: DescriptionFieldProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2.5">
      <PencilSimpleIcon
        size={18}
        className="shrink-0 text-neutral-400 dark:text-mauve-400"
      />
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Descripción (opcional)"
        aria-label="Descripción del movimiento"
        className="w-full text-sm text-neutral-900 dark:text-mauve-50 outline-none placeholder:text-neutral-400 disabled:text-mauve-400"
      />
    </div>
  );
}
